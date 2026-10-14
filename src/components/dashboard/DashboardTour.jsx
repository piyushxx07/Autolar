import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard-tour.css';

const TOUR_KEY = 'autolar-dashboard-tour-complete';
const TOUR_STEPS = [
  { selector: '[data-tour="device-position"]', title: 'Your solar tracker', description: 'See whether your device is online and check its live pan and tilt position.' },
  { selector: '[data-tour="weather-recommendation"]', title: 'Weather & recommendations', description: 'Review local conditions and the system’s recommended operating mode.' },
  { selector: '[data-tour="calculated-power"]', title: 'Calculated power', description: 'Track the solar power your system is producing from its latest readings.' },
  { selector: '[data-tour="net-power"]', title: 'Net power', description: 'Compare power flowing into or out of your system when this reading is available.' },
  { selector: '[data-tour="panel-voltage"]', title: 'Panel voltage', description: 'Check the latest voltage reported by your solar panel.' },
  { selector: '[data-tour="panel-current"]', title: 'Panel current', description: 'See the current your panel is supplying.' },
  { selector: '[data-tour="ldr-sensor"]', title: 'Light sensor', description: 'The LDR readings show the light levels used by your tracker.' },
  { selector: '[data-tour="power-history"]', title: 'Power history', description: 'Explore today’s readings over time in the power chart.' },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getTourStorage() {
  try { return window.localStorage; } catch { return null; }
}

export default function DashboardTour() {
  const { user } = useAuth();
  const tourKey = `${TOUR_KEY}:${String(user?.email || 'demo').toLowerCase()}`;
  const [steps, setSteps] = useState([]);
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [geometry, setGeometry] = useState(null);
  const step = steps[stepIndex];

  const finishTour = useCallback(() => {
    try { getTourStorage()?.setItem(tourKey, 'true'); } catch { /* Continue even if browser storage is unavailable. */ }
    setActive(false);
    setGeometry(null);
  }, [tourKey]);

  const nextStep = useCallback(() => {
    if (stepIndex >= steps.length - 1) finishTour();
    else setStepIndex((index) => index + 1);
  }, [finishTour, stepIndex, steps.length]);

  useEffect(() => {
    const storage = getTourStorage();
    let hasCompleted = false;
    try { hasCompleted = storage?.getItem(tourKey) === 'true'; } catch { hasCompleted = false; }
    if (!storage || hasCompleted) return undefined;
    const timer = window.setTimeout(() => {
      const availableSteps = TOUR_STEPS.filter((item) => document.querySelector(item.selector));
      if (!availableSteps.length) return;
      setSteps(availableSteps);
      setActive(true);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [tourKey]);

  useEffect(() => {
    if (!active || !step) return undefined;
    const target = document.querySelector(step.selector);
    if (!target) {
      if (stepIndex < steps.length - 1) setStepIndex((index) => index + 1);
      else finishTour();
      return undefined;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    let frame = 0;
    const updateGeometry = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const margin = 7;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const popoverWidth = Math.min(340, viewportWidth - 32);
        const popoverHeight = 190;
        const centerX = rect.left + rect.width / 2;
        const left = clamp(centerX - popoverWidth / 2, 16, viewportWidth - popoverWidth - 16);
        const belowTop = rect.bottom + 18;
        const below = belowTop + popoverHeight <= viewportHeight - 16 || rect.top < popoverHeight + 24;
        const top = below
          ? clamp(belowTop, 16, viewportHeight - popoverHeight - 16)
          : clamp(rect.top - popoverHeight - 18, 16, viewportHeight - popoverHeight - 16);
        setGeometry({
          rect: { top: rect.top - margin, right: rect.right + margin, bottom: rect.bottom + margin, left: rect.left - margin, width: rect.width + margin * 2, height: rect.height + margin * 2 },
          viewportWidth,
          viewportHeight,
          popover: { top, left, width: popoverWidth, side: below ? 'below' : 'above', arrowLeft: clamp(centerX - left, 18, popoverWidth - 18) },
        });
      });
    };
    const focusTarget = window.setTimeout(updateGeometry, 320);
    document.addEventListener('scroll', updateGeometry, true);
    window.addEventListener('resize', updateGeometry);
    return () => {
      window.clearTimeout(focusTarget);
      cancelAnimationFrame(frame);
      document.removeEventListener('scroll', updateGeometry, true);
      window.removeEventListener('resize', updateGeometry);
    };
  }, [active, step, stepIndex, steps.length, finishTour]);

  useEffect(() => {
    if (!active) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') finishTour();
      if (event.key === 'ArrowRight') nextStep();
      if (event.key === 'ArrowLeft' && stepIndex > 0) setStepIndex((index) => index - 1);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, stepIndex, steps.length, finishTour, nextStep]);

  if (!active || !step || !geometry) return null;
  const { rect, viewportWidth, viewportHeight, popover } = geometry;
  const overlayStyle = { background: 'rgba(12, 24, 19, .62)' };

  return (
    <div className="dashboard-tour" role="presentation">
      <div className="dashboard-tour-shade dashboard-tour-shade-top" style={{ ...overlayStyle, left: 0, top: 0, width: viewportWidth, height: Math.max(0, rect.top) }} />
      <div className="dashboard-tour-shade dashboard-tour-shade-left" style={{ ...overlayStyle, left: 0, top: Math.max(0, rect.top), width: Math.max(0, rect.left), height: Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(0, rect.top)) }} />
      <div className="dashboard-tour-shade dashboard-tour-shade-right" style={{ ...overlayStyle, left: Math.max(0, rect.right), top: Math.max(0, rect.top), width: Math.max(0, viewportWidth - rect.right), height: Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(0, rect.top)) }} />
      <div className="dashboard-tour-shade dashboard-tour-shade-bottom" style={{ ...overlayStyle, left: 0, top: Math.max(0, rect.bottom), width: viewportWidth, height: Math.max(0, viewportHeight - rect.bottom) }} />
      <div className="dashboard-tour-spotlight" style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }} />

      <section
        className={`dashboard-tour-popover is-${popover.side}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-tour-title"
        style={{ top: popover.top, left: popover.left, width: popover.width, '--tour-arrow-left': `${popover.arrowLeft}px` }}
      >
        <div className="dashboard-tour-topline">
          <span>YOUR DASHBOARD</span>
          <button type="button" className="dashboard-tour-close" onClick={finishTour} aria-label="Skip dashboard tour"><X size={17} /></button>
        </div>
        <div className="dashboard-tour-progress" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((item, index) => <i key={item.selector} className={index <= stepIndex ? 'is-filled' : ''} />)}
        </div>
        <div className="dashboard-tour-copy" key={step.selector}>
          <h2 id="dashboard-tour-title">{step.title}</h2>
          <p>{step.description}</p>
        </div>
        <div className="dashboard-tour-actions">
          <button type="button" className="dashboard-tour-skip" onClick={finishTour}>Skip tour</button>
          <div className="dashboard-tour-navigation">
            <span>{stepIndex + 1} of {steps.length}</span>
            {stepIndex > 0 && <button type="button" className="dashboard-tour-previous" onClick={() => setStepIndex((index) => index - 1)} aria-label="Previous step"><ArrowLeft size={17} /></button>}
            <button type="button" className="dashboard-tour-next" onClick={nextStep}>
              {stepIndex === steps.length - 1 ? 'Done' : 'Next'} {stepIndex < steps.length - 1 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
