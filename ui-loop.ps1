<#
.SYNOPSIS
    Superviseur de la boucle d'amélioration continue UI du portfolio.

.DESCRIPTION
    Relance Claude Code en mode headless indéfiniment.
    - Ne s'arrête que si un fichier STOP apparaît à la racine du repo, ou sur Ctrl+C.
    - Détecte les limites d'usage / rate limits, attend, puis sonde périodiquement
      jusqu'à ce que les crédits soient de nouveau disponibles, et reprend seul.
    - Journalise chaque cycle dans logs\ui-loop\.

.EXAMPLE
    .\ui-loop.ps1
    .\ui-loop.ps1 -IntervalMinutes 2 -Model opus
    .\ui-loop.ps1 -DryRun        # affiche la commande sans lancer Claude

.NOTES
    Pour arrêter :  New-Item (Join-Path $RepoPath 'STOP') -ItemType File
    Pour relancer : Remove-Item (Join-Path $RepoPath 'STOP')
#>

[CmdletBinding()]
param(
    [string] $RepoPath        = 'D:\Project_claude_code\portfolio',
    [string] $MissionFile     = 'MISSION-UI.md',

    # Pause entre deux cycles réussis (minutes).
    [int]    $IntervalMinutes = 3,

    # Fréquence de sonde quand on est en limite d'usage (minutes).
    [int]    $ProbeMinutes    = 10,

    # Attente initiale annoncée après détection d'une limite (minutes),
    # utilisée seulement si le message de Claude ne donne pas d'heure de reset.
    [int]    $LimitWaitMinutes = 20,

    [string] $Model           = 'sonnet',

    # 0 = pas de plafond de tours par cycle.
    [int]    $MaxTurns        = 0,

    [switch] $DryRun
)

$ErrorActionPreference = 'Continue'
$script:StartedAt = Get-Date

# ---------------------------------------------------------------------------
# Chemins
# ---------------------------------------------------------------------------

if (-not (Test-Path $RepoPath)) {
    Write-Host "[FATAL] Repo introuvable : $RepoPath" -ForegroundColor Red
    exit 1
}

$LogDir     = Join-Path $RepoPath 'logs\ui-loop'
$StopFile   = Join-Path $RepoPath 'STOP'
$PauseFile  = Join-Path $RepoPath 'PAUSE'
$StateFile  = Join-Path $LogDir  'cycle-count.txt'
$RunLog     = Join-Path $LogDir  ('supervisor-{0:yyyyMMdd}.log' -f (Get-Date))

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

# ---------------------------------------------------------------------------
# Utilitaires
# ---------------------------------------------------------------------------

function Write-Log {
    param(
        [string] $Message,
        [ValidateSet('INFO','WARN','ERROR','OK','WAIT')] [string] $Level = 'INFO'
    )
    $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line  = "[$stamp][$Level] $Message"

    $color = switch ($Level) {
        'OK'    { 'Green' }
        'WARN'  { 'Yellow' }
        'ERROR' { 'Red' }
        'WAIT'  { 'Cyan' }
        default { 'Gray' }
    }
    Write-Host $line -ForegroundColor $color
    Add-Content -Path $RunLog -Value $line -Encoding UTF8
}

function Get-CycleNumber {
    if (Test-Path $StateFile) {
        $n = 0
        if ([int]::TryParse((Get-Content $StateFile -Raw).Trim(), [ref]$n)) { return $n }
    }
    return 0
}

function Set-CycleNumber {
    param([int] $Number)
    Set-Content -Path $StateFile -Value $Number -Encoding UTF8
}

function Test-ShouldStop {
    if (Test-Path $StopFile) {
        Write-Log "Fichier STOP détecté. Arrêt du superviseur." 'WARN'
        return $true
    }
    return $false
}

function Wait-WhilePaused {
    while ((Test-Path $PauseFile) -and -not (Test-Path $StopFile)) {
        Write-Log "Fichier PAUSE présent — en attente (re-vérification dans 60 s)." 'WAIT'
        Start-Sleep -Seconds 60
    }
}

function Start-CountdownSleep {
    param([int] $Minutes, [string] $Reason)

    $end = (Get-Date).AddMinutes($Minutes)
    Write-Log ("{0} — reprise prévue à {1:HH:mm:ss}" -f $Reason, $end) 'WAIT'

    while ((Get-Date) -lt $end) {
        if (Test-ShouldStop) { return $false }
        $remaining = [int]([math]::Ceiling(($end - (Get-Date)).TotalSeconds))
        Write-Host ("`r   ⏳ reprise dans {0:mm\:ss}   " -f [timespan]::FromSeconds($remaining)) -NoNewline
        Start-Sleep -Seconds ([math]::Min(15, [math]::Max(1, $remaining)))
    }
    Write-Host "`r                                  `r" -NoNewline
    return $true
}

# ---------------------------------------------------------------------------
# Détection des limites d'usage
# ---------------------------------------------------------------------------

$script:LimitPatterns = @(
    'usage limit',
    'rate limit',
    'rate_limit',
    'limit reached',
    'limit will reset',
    'you have (?:hit|reached)',
    'out of (?:credits|tokens)',
    'insufficient (?:credits|quota|balance)',
    'quota exceeded',
    'too many requests',
    '\b429\b',
    'overloaded_error',
    'upgrade to continue'
) -join '|'

function Test-LimitHit {
    param([string] $Output)
    if ([string]::IsNullOrWhiteSpace($Output)) { return $false }
    return [bool]($Output -imatch $script:LimitPatterns)
}

function Test-AuthProblem {
    param([string] $Output)
    if ([string]::IsNullOrWhiteSpace($Output)) { return $false }
    return [bool]($Output -imatch 'invalid api key|authentication|unauthorized|not logged in|please run /login|\b401\b')
}

<#
  Essaie d'extraire une heure de reset du message de Claude.
  Reconnaît notamment :
    "resets at 3pm", "resets at 15:00", "try again in 42 minutes",
    "available again at 21:30"
  Retourne un nombre de minutes, ou $null si indéterminable.
#>
function Get-ResetDelayMinutes {
    param([string] $Output)
    if ([string]::IsNullOrWhiteSpace($Output)) { return $null }

    # "in X minutes" / "in X hours"
    if ($Output -imatch '(?:try again|retry|available again|resets?)\s+in\s+(\d+)\s*(minute|min|hour|hr)') {
        $qty  = [int]$Matches[1]
        $unit = $Matches[2].ToLower()
        $mins = if ($unit -like 'hour*' -or $unit -eq 'hr') { $qty * 60 } else { $qty }
        return [math]::Min($mins + 2, 720)
    }

    # "resets at 3pm" / "resets at 15:00" / "available again at 9:30am"
    if ($Output -imatch '(?:resets?|available again|try again)\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?') {
        $h  = [int]$Matches[1]
        $m  = if ($Matches[2]) { [int]$Matches[2] } else { 0 }
        $ap = $Matches[3]

        if ($ap) {
            $ap = $ap.ToLower()
            if ($ap -eq 'pm' -and $h -lt 12) { $h += 12 }
            if ($ap -eq 'am' -and $h -eq 12) { $h  = 0 }
        }
        if ($h -gt 23 -or $m -gt 59) { return $null }

        $now    = Get-Date
        $target = Get-Date -Hour $h -Minute $m -Second 0
        if ($target -le $now) { $target = $target.AddDays(1) }

        $delta = [int]([math]::Ceiling(($target - $now).TotalMinutes)) + 2
        if ($delta -gt 720) { return $null }   # >12 h : suspect, on ignore
        return $delta
    }

    return $null
}

# ---------------------------------------------------------------------------
# Appels à Claude Code
# ---------------------------------------------------------------------------

function Get-ClaudeArgs {
    param([string] $Prompt, [switch] $Probe)

    $a = @('-p', $Prompt, '--permission-mode', 'bypassPermissions', '--output-format', 'text')

    if ($Model)   { $a += @('--model', $Model) }
    if ($Probe)   { $a += @('--max-turns', '1') }
    elseif ($MaxTurns -gt 0) { $a += @('--max-turns', "$MaxTurns") }

    return $a
}

function Invoke-Claude {
    param([string] $Prompt, [switch] $Probe, [string] $LogFile)

    $cliArgs = Get-ClaudeArgs -Prompt $Prompt -Probe:$Probe

    if ($DryRun) {
        Write-Log ("[DRY-RUN] claude " + ($cliArgs -join ' ')) 'INFO'
        return [pscustomobject]@{ ExitCode = 0; Output = 'dry-run'; }
    }

    Push-Location $RepoPath
    try {
        $raw = & claude @cliArgs 2>&1 | ForEach-Object { "$_" }
        $code = $LASTEXITCODE
    }
    catch {
        $raw  = @("EXCEPTION: $($_.Exception.Message)")
        $code = 1
    }
    finally {
        Pop-Location
    }

    $text = ($raw -join [Environment]::NewLine)

    if ($LogFile) {
        Set-Content -Path $LogFile -Value $text -Encoding UTF8
    }
    if (-not $Probe) {
        Write-Host $text
    }

    return [pscustomobject]@{ ExitCode = $code; Output = $text }
}

function Test-ClaudeAvailable {
    # Sonde minimale : si elle passe, les crédits sont revenus.
    $r = Invoke-Claude -Prompt 'Réponds exactement: OK' -Probe
    if ($r.ExitCode -ne 0)            { return $false }
    if (Test-LimitHit $r.Output)      { return $false }
    if (Test-AuthProblem $r.Output)   { return $false }
    return $true
}

# ---------------------------------------------------------------------------
# Prompt de cycle
# ---------------------------------------------------------------------------

function Get-CyclePrompt {
    param([int] $Cycle)

    return @"
Tu exécutes le cycle #$Cycle de la boucle d'amélioration continue de l'UI du portfolio.

1. Lis INTÉGRALEMENT le fichier $MissionFile à la racine du repo. C'est ta mission.
2. Lis docs/ui-loop/PROGRESS.md pour reprendre exactement au point de reprise du
   dernier cycle. Si le fichier n'existe pas, applique la procédure d'amorçage (§8).
3. Exécute les 7 phases du cycle dans l'ordre, sans en sauter aucune.
4. Termine impérativement par la phase 7 (mise à jour de PROGRESS.md) avant de
   rendre la main, même si tu sens que tu approches d'une limite de contexte.
   Un cycle non journalisé est un cycle perdu.

Contraintes de ce run :
- Ne demande aucune validation. Tu décides et tu implémentes.
- Ne termine pas ta réponse par une question.
- Si une décision exige un arbitrage humain, consigne-la dans
  docs/ui-loop/QUESTIONS.md et passe au chantier suivant.
- Priorité absolue : la zone située sous les slides de projets, à partir de la
  section "Analytical profile".
"@
}

# ---------------------------------------------------------------------------
# Boucle principale
# ---------------------------------------------------------------------------

Write-Host ''
Write-Host '  ╔══════════════════════════════════════════════════════════╗' -ForegroundColor DarkCyan
Write-Host '  ║   BOUCLE UI — PORTFOLIO · superviseur Claude Code        ║' -ForegroundColor DarkCyan
Write-Host '  ╚══════════════════════════════════════════════════════════╝' -ForegroundColor DarkCyan
Write-Host ''
Write-Log "Repo            : $RepoPath"
Write-Log "Mission         : $MissionFile"
Write-Log "Modèle          : $Model"
Write-Log "Intervalle      : $IntervalMinutes min entre cycles"
Write-Log "Sonde si limite : toutes les $ProbeMinutes min"
Write-Log "Arrêt           : créer le fichier $StopFile"
Write-Host ''

if (Test-Path $StopFile) {
    Write-Log "Un fichier STOP existe déjà. Supprime-le pour démarrer." 'WARN'
    exit 0
}

$cycle             = Get-CycleNumber
$consecutiveErrors = 0

while ($true) {

    if (Test-ShouldStop) { break }
    Wait-WhilePaused
    if (Test-ShouldStop) { break }

    $cycle++
    Set-CycleNumber $cycle

    $cycleLog = Join-Path $LogDir ('cycle-{0:0000}-{1:yyyyMMdd-HHmmss}.log' -f $cycle, (Get-Date))

    Write-Host ''
    Write-Log "───────── CYCLE $cycle ─────────" 'OK'

    $result = Invoke-Claude -Prompt (Get-CyclePrompt -Cycle $cycle) -LogFile $cycleLog

    # ---- Limite d'usage : on attend puis on sonde jusqu'au retour des crédits ----
    if (Test-LimitHit $result.Output) {

        $cycle--                     # ce cycle n'a pas vraiment eu lieu
        Set-CycleNumber $cycle

        $delay = Get-ResetDelayMinutes $result.Output
        if (-not $delay) { $delay = $LimitWaitMinutes }

        Write-Log "Limite d'usage atteinte. Le travail reprendra automatiquement." 'WARN'

        if (-not (Start-CountdownSleep -Minutes $delay -Reason "Limite d'usage")) { break }

        # Sonde en boucle jusqu'au retour des crédits.
        $probeRound = 0
        while ($true) {
            if (Test-ShouldStop) { break }
            $probeRound++
            Write-Log "Sonde de disponibilité #$probeRound…" 'WAIT'

            if (Test-ClaudeAvailable) {
                Write-Log "Crédits de nouveau disponibles — reprise de la mission." 'OK'
                break
            }

            if (-not (Start-CountdownSleep -Minutes $ProbeMinutes -Reason 'Toujours en limite')) { break }
        }

        if (Test-ShouldStop) { break }
        continue
    }

    # ---- Problème d'authentification ----
    if (Test-AuthProblem $result.Output) {
        Write-Log "Problème d'authentification Claude Code. Lance 'claude' puis /login." 'ERROR'
        Write-Log "Nouvelle tentative dans 15 minutes." 'WAIT'
        $cycle--; Set-CycleNumber $cycle
        if (-not (Start-CountdownSleep -Minutes 15 -Reason 'Attente réauthentification')) { break }
        continue
    }

    # ---- Erreur générique ----
    if ($result.ExitCode -ne 0) {
        $consecutiveErrors++
        Write-Log "Cycle terminé en erreur (code $($result.ExitCode)). Échecs consécutifs : $consecutiveErrors" 'ERROR'

        # Backoff exponentiel plafonné à 30 min — on ne s'arrête jamais.
        $backoff = [math]::Min(30, [math]::Pow(2, [math]::Min($consecutiveErrors, 5)))
        if (-not (Start-CountdownSleep -Minutes $backoff -Reason "Backoff après erreur")) { break }
        continue
    }

    # ---- Cycle réussi ----
    $consecutiveErrors = 0
    Write-Log "Cycle $cycle terminé. Log : $cycleLog" 'OK'

    $uptime = (Get-Date) - $script:StartedAt
    Write-Log ("Uptime superviseur : {0:dd\j\ hh\h\ mm\m}" -f $uptime)

    if (-not (Start-CountdownSleep -Minutes $IntervalMinutes -Reason 'Pause inter-cycles')) { break }
}

Write-Host ''
Write-Log "Superviseur arrêté après $cycle cycle(s)." 'WARN'
Write-Log "Pour relancer : supprime le fichier STOP puis relance ce script." 'INFO'
