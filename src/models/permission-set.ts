export class PermissionSet {
  toString() {
    let filteredCount = 0;
    const allowed = Object.keys(this).filter(key => {
      const value = Reflect.get(this, key);
      if (typeof value === 'boolean' && value) {
        return true;
      }
      filteredCount += 1;
      return false;
    });
    if (allowed.length === 0) {
      return '';
    }
    if (filteredCount === 0) {
      return '*';
    }
    return allowed.join(',');
  }

  setAll(newValue: boolean) {
    Object.keys(this).forEach(key => {
      const value = Reflect.get(this, key);
      if (typeof value === 'boolean') {
        Reflect.set(this, key, newValue);
      }
    });
  }

  parse(permissions: string) {
    const split = permissions.split(',').filter(permission => permission.length > 0);
    if (split.length === 0) {
      this.setAll(false);
    }
    if (split.length === 1 && split[0] === '*') {
      this.setAll(true);
    }
    split.forEach(permission => {
      if (this.hasOwnProperty(permission)) {
        Reflect.set(this, permission, true);
      }
    });
    return this;
  }
}
