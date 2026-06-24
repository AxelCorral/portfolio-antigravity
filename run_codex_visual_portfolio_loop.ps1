$ErrorActionPreference = "Continue"

Set-Location "D:\Project_claude_code\portfolio"

$cyclePrompt = @"
Read CODEX_PORTFOLIO_VISUAL_POLISH.md and execute exactly one autonomous visual portfolio polish cycle.

Your role:
- senior frontend designer;
- UI engineer;
- portfolio reviewer.

Goal:
Improve the visual quality, clarity, recruiter impact, and professional feel of Axel Corral's portfolio.

Focus on:
- hero section;
- visual hierarchy;
- spacing;
- layout;
- typography;
- project cards;
- football-pipeline project presentation;
- calls to action;
- responsive mobile design;
- dark theme consistency;
- subtle professional animations.

Rules:
- Work only inside D:\Project_claude_code\portfolio.
- Do not touch football-pipeline.
- Do not touch secrets, .env, credentials, billing, credits, deployment, or unrelated files.
- Do not add heavy dependencies unless absolutely necessary.
- Do not redesign the whole site in one cycle.
- Choose exactly one useful visual or UX improvement.
- Modify the minimum useful files.
- Run relevant checks if available.
- Commit cleanly.
- Summarize the cycle.

Do not ask for approval unless critically blocked.
"@

while ($true) {
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "Nouveau cycle Codex Visual Portfolio Polish"
    Write-Host "=========================================="
    Write-Host ""

    codex exec --dangerously-bypass-approvals-and-sandbox $cyclePrompt

    Write-Host ""
    Write-Host "Cycle Codex Portfolio Visual terminé. Redémarrage dans 10 secondes..."
    Start-Sleep -Seconds 10
}