(() => {
    'use strict';

    // Обозначаем константы
    const PLATFORM_MAPPING = {
        WINDOWS: 'Windows',
        LINUX: 'Linux',
        APPLE: 'Apple',
        OTHER: 'Other'
    };

    // Функция для определенния платформы по userAgent
    const detectPlatform = (userAgent) => {
        if (/win(dows|16|32|64|95|98|nt)|wow64/gi.test(userAgent)) return PLATFORM_MAPPING.WINDOWS;
        if (/android|linux|cros/gi.test(userAgent)) return PLATFORM_MAPPING.LINUX;
        if (/(i(os|p(ad|hone|od)))|mac/gi.test(userAgent)) return PLATFORM_MAPPING.APPLE;
        return PLATFORM_MAPPING.OTHER;
    };

    // Получаем информацию о платформе пользователя + userAgent
    const { userAgent, platform } = navigator || {};
    const platformInfo = detectPlatform(userAgent || '');

    // Пример утилиты для логгирования событий
    const logResults = (() => {
        const logs = {};
        let totalTime = 0;

        return {
            log: (testName, passed, time = 0) => {
                totalTime += time;
                logs[testName] = `${time.toFixed(2)}ms`;
                return passed;
            },
            getLogs: () => logs,
            getTotalTime: () => totalTime
        };
    })();

    // Образец тестирования доступности WebGL на устройстве пользователя
    const detectWebGLRenderer = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'WebGL not supported';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : 'Renderer info unavailable';
    };

    // Сбор данных
    const renderer = detectWebGLRenderer();
    logResults.log('WebGL Renderer Detection', !!renderer);

    // Логирование полученных данных.
    console.log('Platform Info:', platformInfo);
    console.log('WebGL Renderer:', renderer);
    console.log('Logs:', logResults.getLogs());
})();
