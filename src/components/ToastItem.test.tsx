/** @vitest-environment jsdom */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { expect, it, describe, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../context/ToastContext';

const TestApp = ({ message = 'Test', duration = 3000 }) => {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast({ message, type: 'info', duration })}>
      Показать тост
    </button>
  );
};

describe('Система уведомлений', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('не создает дубликаты при частом нажатии', () => {
    render(
      <ToastProvider>
        <TestApp message="Сообщение" />
      </ToastProvider>
    );

    const button = screen.getByText('Показать тост');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    const toasts = screen.getAllByText('Сообщение');
    expect(toasts.length).toBe(1);
  });

  it('останавливает таймер при наведении курсора', () => {
    render(
      <ToastProvider>
        <TestApp duration={3000} />
      </ToastProvider>
    );

    const button = screen.getAllByText('Показать тост')[0];
    fireEvent.click(button);

    const toast = screen.getByRole('alert');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(toast).toBeDefined();

    fireEvent.mouseEnter(toast);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByRole('alert')).not.toBeNull();

    fireEvent.mouseLeave(toast);

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(screen.queryByRole('alert')).toBeNull();
  });
});