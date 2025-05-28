
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

  addPowerUp(powerUpId: string, uses: number = 1) {
    const existing = this.activePowerUps.find(p => p.id === powerUpId);
    if (existing) {
      existing.usesLeft += uses;
    } else {
      this.activePowerUps.push({
        id: powerUpId,
        name: this.getPowerUpName(powerUpId),
        type: this.getPowerUpType(powerUpId),
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

  private getPowerUpName(id: string): string {
    const names: Record<string, string> = {
      'time-freeze': 'Time Freeze',
      'double-xp': 'Double XP',
      'accuracy-boost': 'Accuracy Boost',
      'shield': 'Error Shield'
    };
    return names[id] || 'Unknown Power-up';
  }

  private getPowerUpType(id: string): PowerUp['type'] {
    const types: Record<string, PowerUp['type']> = {
      'time-freeze': 'timeFreeze',
      'double-xp': 'doubleXP',
      'accuracy-boost': 'accuracyBoost',
      'shield': 'shield'
    };
    return types[id] || 'shield';
  }
}

export const powerUpManager = new PowerUpManager();
