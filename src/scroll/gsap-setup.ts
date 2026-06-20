import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, CustomEase, MotionPathPlugin, DrawSVGPlugin, useGSAP);

// Mirrors the easings defined in tokens.css — single source of truth is the
// design plan, duplicated here because GSAP can't read CSS custom properties.
CustomEase.create("ease-float", "0.16, 1, 0.3, 1");
CustomEase.create("ease-fall", "0.7, 0, 0.84, 0");
CustomEase.create("ease-drift", "0.45, 0, 0.55, 1");
