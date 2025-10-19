import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const figuresRef = useRef(null);

  const handleMouseMove = (e) => {
    if (figuresRef.current) {
      const rect = figuresRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== 'password') {
      setIsWrongPassword(true);
      setTimeout(() => setIsWrongPassword(false), 2000);
      return;
    }
    onLogin({ username });
    onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[600px] flex overflow-hidden"
          >
            {/* Левая часть - анимированные фигуры (70%) */}
            <div 
              ref={figuresRef}
              className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden"
              onMouseMove={handleMouseMove}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-8">
                  <AnimatedFigure 
                    index={0}
                    mousePosition={mousePosition}
                    focusedField={focusedField}
                    isWrongPassword={isWrongPassword}
                  />
                  <AnimatedFigure 
                    index={1}
                    mousePosition={mousePosition}
                    focusedField={focusedField}
                    isWrongPassword={isWrongPassword}
                  />
                  <AnimatedFigure 
                    index={2}
                    mousePosition={mousePosition}
                    focusedField={focusedField}
                    isWrongPassword={isWrongPassword}
                  />
                  <AnimatedFigure 
                    index={3}
                    mousePosition={mousePosition}
                    focusedField={focusedField}
                    isWrongPassword={isWrongPassword}
                  />
                </div>
              </div>
            </div>

            {/* Правая часть - форма (30%) */}
            <div className="w-[30%] bg-white p-8 flex flex-col">
              <div className="flex-1">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                    {isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {isLogin ? 'Войдите в свой аккаунт' : 'Присоединяйтесь к Lumiára'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Логин
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                      placeholder="Введите логин"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
                      placeholder="Введите пароль"
                    />
                  </div>

                  {isWrongPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      Неверный пароль! Попробуйте "password"
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
                  >
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                  </motion.button>
                </form>

                <div className="text-center mt-6">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                  >
                    {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-sm self-center"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnimatedFigure = ({ index, mousePosition, focusedField, isWrongPassword }) => {
  const figureRef = useRef(null);
  const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (figureRef.current) {
      const rect = figureRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setLocalMouse({
        x: mousePosition.x - (centerX - rect.left),
        y: mousePosition.y - (centerY - rect.top)
      });
    }
  }, [mousePosition]);

  const getEyePosition = (eyeOffsetX) => {
    const maxMove = 3;
    const distance = Math.sqrt(localMouse.x ** 2 + localMouse.y ** 2);
    const angle = Math.atan2(localMouse.y, localMouse.x);
    
    const moveX = Math.cos(angle) * Math.min(maxMove, distance * 0.1);
    const moveY = Math.sin(angle) * Math.min(maxMove, distance * 0.1);
    
    return { x: eyeOffsetX + moveX, y: moveY };
  };

  const getMouthShape = () => {
    if (isWrongPassword) {
      return { d: "M 15 25 Q 25 15 35 25", strokeWidth: 2 };
    }
    if (focusedField === 'username') {
      return { d: "M 15 20 Q 25 30 35 20", strokeWidth: 2 };
    }
    if (focusedField === 'password') {
      return { d: "M 15 25 Q 25 20 35 25", strokeWidth: 1.5 };
    }
    return { d: "M 15 25 Q 25 25 35 25", strokeWidth: 1.5 };
  };

  const getFigureTransform = () => {
    if (isWrongPassword) {
      return { scale: 0.9, rotate: index % 2 === 0 ? -5 : 5 };
    }
    if (focusedField === 'password' && index === 3) {
      return { scale: 1.1, rotate: 10 };
    }
    if (focusedField === 'password') {
      return { scale: 0.8, rotate: -20 };
    }
    return { scale: 1, rotate: 0 };
  };

  const { scale, rotate } = getFigureTransform();
  const leftEye = getEyePosition(-5);
  const rightEye = getEyePosition(5);
  const mouth = getMouthShape();

  // Используем градиенты из Tailwind config
  const gradients = [
    'bg-gradient-to-br from-purple-400 to-pink-400',
    'bg-gradient-to-br from-blue-400 to-cyan-400',
    'bg-gradient-to-br from-green-400 to-emerald-400',
    'bg-gradient-to-br from-orange-400 to-red-400'
  ];

  return (
    <motion.div
      ref={figureRef}
      className={`w-20 h-20 ${gradients[index]} rounded-2xl relative flex items-center justify-center`}
      animate={{
        scale,
        rotate,
        y: isWrongPassword ? [0, -5, 0] : 0
      }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 100
      }}
    >
      {/* Глаза */}
      <div className="absolute top-6 left-6 w-3 h-3 bg-white rounded-full overflow-hidden">
        <motion.div
          className="w-1.5 h-1.5 bg-black rounded-full"
          animate={{ x: leftEye.x, y: leftEye.y }}
          transition={{ type: "spring", stiffness: 300, damping: 5 }}
        />
      </div>
      <div className="absolute top-6 right-6 w-3 h-3 bg-white rounded-full overflow-hidden">
        <motion.div
          className="w-1.5 h-1.5 bg-black rounded-full"
          animate={{ x: rightEye.x, y: rightEye.y }}
          transition={{ type: "spring", stiffness: 300, damping: 5 }}
        />
      </div>

      {/* Рот */}
      <svg 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-3" 
        viewBox="0 0 50 30"
      >
        <motion.path
          d={mouth.d}
          stroke="currentColor"
          strokeWidth={mouth.strokeWidth}
          fill="none"
          strokeLinecap="round"
          animate={{
            d: mouth.d,
            strokeWidth: mouth.strokeWidth
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        />
      </svg>

      {/* Особые состояния - подглядывающая фигура */}
      {focusedField === 'password' && index === 3 && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </motion.div>
  );
};

export default LoginModal;