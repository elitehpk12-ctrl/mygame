import { useGameStore } from './state/useGameStore.js';
import GameCanvas from './components/GameCanvas.jsx';
import HUD from './components/hud/HUD.jsx';
import PauseMenu from './components/menus/PauseMenu.jsx';
import CharacterPanel from './components/menus/CharacterPanel.jsx';
import WorldMapScreen from './components/worldmap/WorldMapScreen.jsx';
import ResultScreen from './components/overlays/ResultScreen.jsx';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const selectedLevelId = useGameStore((s) => s.selectedLevelId);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {screen === 'worldmap' && <WorldMapScreen />}
      {screen === 'character' && <CharacterPanel />}

      {screen === 'combat' && selectedLevelId != null && (
        <div className="relative h-full w-full">
          <GameCanvas levelId={selectedLevelId} />
          <HUD />
          <PauseMenu />
        </div>
      )}

      {(screen === 'victory' || screen === 'defeat') && <ResultScreen outcome={screen} />}
    </div>
  );
}
