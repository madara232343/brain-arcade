
export interface PowerUp {
  id: string;
  name: string;
  type: 'timeFreeze' | 'doubleXP' | 'accuracyBoost' | 'shield';
  active: boolean;
  usesLeft: number;
}

class PowerUpManager {
  private activePowerUps: PowerUp[] = [];
  private listeners: ((powerUps: PowerUp[]) => void)[] = [];

  addPowerUp(type: string, name: string, uses: number = 1) {
    const existing = this.activePowerUps.find(p => p.type === type);
    if (existing) {
      existing.usesLeft += uses;
    } else {
      this.activePowerUps.push({
        id: Math.random().toString(36).substr(2, 9),
        name,
        type: type as PowerUp['type'],
        active: false,
        usesLeft: uses
      });
    }
    this.notifyListeners();
  }

  usePowerUp(powerUpId: string): boolean {
    const powerUp = this.activePowerUps.find(p => p.id === powerUpId && p.usesLeft > 0);
    if (powerUp) {
      powerUp.active = true;
      powerUp.usesLeft--;
      if (powerUp.usesLeft === 0) {
        this.activePowerUps = this.activePowerUps.filter(p => p.id !== powerUpId);
      }
      this.notifyListeners();
      return true;
    }
    return false;
  }

  getActivePowerUps(): PowerUp[] {
    return this.activePowerUps;
  }

  clearAllPowerUps() {
    this.activePowerUps = [];
    this.notifyListeners();
  }

  deactivatePowerUp(powerUpId: string) {
    const powerUp = this.activePowerUps.find(p => p.id === powerUpId);
    if (powerUp) {
      powerUp.active = false;
      this.notifyListeners();
    }
  }

  subscribe(callback: (powerUps: PowerUp[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.activePowerUps));
  }
}

export const powerUpManager = new PowerUpManager();
