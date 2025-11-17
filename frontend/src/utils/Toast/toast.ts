type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

class ToastManager {
  private listeners: Set<(toasts: Toast[]) => void> = new Set();
  private toasts: Toast[] = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  show(type: ToastType, message: string, title?: string, duration = 5000) {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, type, message, title };

    this.toasts.push(toast);
    this.notify();

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(message: string, title = "Success") {
    return this.show("success", message, title);
  }

  error(message: string, title = "Error") {
    return this.show("error", message, title);
  }

  info(message: string, title = "Info") {
    return this.show("info", message, title);
  }

  warning(message: string, title = "Warning") {
    return this.show("warning", message, title);
  }
}

const toast = new ToastManager();

export default toast;
