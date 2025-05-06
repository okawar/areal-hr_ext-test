import numpy as np
import matplotlib.pyplot as plt

# Функция для построения графиков
def plot_signal_and_spectrum(f_n, title, N=8):
    n = np.arange(N)  # Временные точки
    F_k = np.fft.fft(f_n)  # Быстрое преобразование Фурье
    
    # Амплитудный спектр
    amplitude_spectrum = np.abs(F_k)
    
    # Фазовый спектр
    phase_spectrum = np.angle(F_k)

    # Построение графиков
    plt.figure(figsize=(12, 6))

    # Сигнал во времени
    plt.subplot(3, 1, 1)
    plt.stem(n, f_n, basefmt=" ")
    plt.title(f"Сигнал: {title}")
    plt.xlabel("n")
    plt.ylabel("f[n]")

    # Амплитудный спектр
    plt.subplot(3, 1, 2)
    plt.stem(n, amplitude_spectrum, basefmt=" ")
    plt.title("Амплитудный спектр")
    plt.xlabel("k")
    plt.ylabel("|F[k]|")

    # Фазовый спектр
    plt.subplot(3, 1, 3)
    plt.stem(n, phase_spectrum, basefmt=" ")
    plt.title("Фазовый спектр")
    plt.xlabel("k")
    plt.ylabel("arg(F[k])")

    plt.tight_layout()
    plt.show()

# Пример 1: Косинусный сигнал
N = 8
n = np.arange(N)
# f_cos = np.cos(np.pi / 4 * n)
# plot_signal_and_spectrum(f_cos, "cos(π/4 * n)")

# # Пример 2: Прямоугольный импульс
# f_rect = np.concatenate([np.ones(N // 2), np.zeros(N // 2)])
# plot_signal_and_spectrum(f_rect, "Прямоугольный импульс длиной N/2")

# Пример 3: Сложный сигнал (синус + косинус)
f_complex = np.cos(5 * np.pi / 4 * n) + np.sin(6 * np.pi / 4 * n)
plot_signal_and_spectrum(f_complex, "cos(5π/4 * n) + sin(6π/4 * n)")
