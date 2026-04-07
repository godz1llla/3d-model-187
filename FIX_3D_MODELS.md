# Исправление проблемы с 3D моделями

## Проблема
Ошибка в консоли: `window.modelViewer.loadModel is not a function`

## Причина
Конструктор `ModelViewer3D` может вернуть `undefined`, если контейнер не найден или THREE.js не загружен. В JavaScript, если конструктор делает `return` (не `this`), объект не создается.

## Решение
1. Убедиться, что viewer инициализируется правильно
2. Проверить, что GLTFLoader загружен
3. Добавить проверки перед вызовом loadModel

## Проверка
1. Откройте консоль (F12)
2. Проверьте, что Three.js загружен: `typeof THREE`
3. Проверьте, что GLTFLoader загружен: `typeof THREE.GLTFLoader`
4. Проверьте viewer: `window.modelViewer`
5. Проверьте метод: `typeof window.modelViewer.loadModel`

Если viewer существует, но loadModel не функция, значит объект создан неправильно.
