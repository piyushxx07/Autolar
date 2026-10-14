import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const PwaInstallPrompt = () => {
  const [visible, setVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('autolar-install-prompt-dismissed') === 'true';
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    if (!dismissed && !isStandalone()) {
      const timer = window.setTimeout(() => setVisible(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => {
      setVisible(false);
      setInstallPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('autolar-install-prompt-dismissed', 'true');
    setVisible(false);
  };

  const install = async () => {
    if (!installPrompt) {
      setShowInstructions((current) => !current);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') dismiss();
    setInstallPrompt(null);
  };

  if (!visible) return null;

  return (
    <aside className="pwa-install-prompt" role="dialog" aria-label="Install AutoLar">
      <button className="pwa-install-close" type="button" onClick={dismiss} aria-label="Dismiss install prompt"><X size={17} /></button>
      <img className="pwa-install-icon" src="/icons/autolar-192.png" alt="" />
      <div className="pwa-install-copy">
        <strong>Install AutoLar</strong>
        <span>Get quick access to your solar dashboard as an app.</span>
        {showInstructions && <small>{isIos ? 'Tap Share, then choose "Add to Home Screen".' : 'Open your browser menu and choose "Install app" or "Add to Home screen".'}</small>}
      </div>
      <button className="pwa-install-action" type="button" onClick={install}>{installPrompt ? 'Install' : 'How to install'}</button>
    </aside>
  );
};

export default PwaInstallPrompt;
