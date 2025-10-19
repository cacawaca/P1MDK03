import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const modalRef = useRef(null);

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
      setIsLoading(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [isOpen]);

  // Сброс при переключении между логином/регистрацией
  useEffect(() => {
    setActiveStep(0);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }, [isLogin]);

  // Анимационные значения для 3D эффекта
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]));
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]));

  // Генерация частиц для фона
  useEffect(() => {
    if (!isOpen) return;

    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.2
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX) % 100,
        y: (p.y + p.speedY) % 100
      })));
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleMouseMove = (e) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Проверка пароля
    if (formData.password !== 'password') {
      setIsLoading(false);
      return;
    }
    
    onLogin({ username: formData.username || formData.email });
    onClose();
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (activeStep < 2) setActiveStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Фон в стиле Lumiára */}
          <div className="absolute inset-0 bg-gradient-to-br from-cream-50 to-cream-100" />
          
          {/* Анимированные частицы */}
          <div className="absolute inset-0">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-brand-600/20"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  opacity: particle.opacity
                }}
                animate={{
                  x: [0, particle.speedX * 50],
                  y: [0, particle.speedY * 50]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>

          {/* Основной модальный контейнер */}
          <motion.div
            ref={modalRef}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseMove={handleMouseMove}
            className="relative w-full max-w-4xl h-[600px] bg-white/80 backdrop-blur-sm rounded-3xl border border-cream-200 shadow-xl overflow-hidden"
          >
            {/* Декоративные элементы в стиле Lumiára */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-600/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-700/5 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

            <div className="relative z-10 flex h-full">
              {/* Левая панель - брендинг */}
              <div className="flex-1 p-12 flex flex-col justify-between relative overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-900"
                >
                  <h1 className="font-serif text-5xl font-bold mb-4 text-brand-600">
                    Lumiára
                  </h1>
                  <p className="text-xl text-gray-700 mb-2">
                    {isLogin ? 'С возвращением' : 'Начните путь с нами'}
                  </p>
                  <p className="text-lg text-gray-600 opacity-80">
                    {isLogin 
                      ? 'Сияние, основанное на науке' 
                      : 'Создайте свой уникальный ритуал красоты'
                    }
                  </p>
                </motion.div>

                {/* Прогресс шагов */}
                <motion.div className="space-y-4">
                  {[0, 1, 2].map(step => (
                    <motion.div
                      key={step}
                      className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all interactive ${
                        step === activeStep 
                          ? 'bg-white/60 border-brand-600/30 shadow-sm' 
                          : 'bg-white/30 border-gray-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveStep(step)}
                    >
                      <div className={`w-3 h-3 rounded-full transition-colors ${
                        step === activeStep ? 'bg-brand-600' : 'bg-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        step === activeStep ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {['Ваши данные', 'Безопасность', 'Персонализация'][step]}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Декоративные элементы */}
                <div className="absolute inset-0 pointer-events-none">
                  {['🌸', '✨', '💎', '🌿'].map((emoji, index) => (
                    <motion.div
                      key={index}
                      className="absolute text-xl opacity-40"
                      initial={{
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                        scale: 0,
                        rotate: Math.random() * 360
                      }}
                      animate={{
                        y: [0, -15, 0],
                        scale: [0, 0.8, 0.6],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 6 + index * 2,
                        delay: index * 0.8,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Правая панель - форма */}
              <div className="w-2/5 bg-white/90 backdrop-blur-sm p-8 flex flex-col border-l border-gray-100">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1"
                >
                  <div className="text-center mb-8">
                    <motion.h2 
                      className="font-serif text-2xl font-bold text-gray-900 mb-2"
                      key={isLogin ? 'login' : 'register'}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {isLogin ? 'Вход в Lumiára' : 'Регистрация'}
                    </motion.h2>
                    <p className="text-gray-600 text-sm">
                      {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {activeStep === 0 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="relative">
                            <motion.input
                              type="text"
                              value={isLogin ? formData.username : formData.email}
                              onChange={(e) => handleInputChange(isLogin ? 'username' : 'email', e.target.value)}
                              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none transition-all interactive"
                              placeholder=" "
                            />
                            <motion.label
                              className={`absolute left-4 pointer-events-none transition-all bg-white px-1 ${
                                (isLogin ? formData.username : formData.email) ? 'top-0 text-xs text-brand-600' : 'top-3 text-gray-500'
                              }`}
                              animate={{
                                y: (isLogin ? formData.username : formData.email) ? -12 : 0,
                              }}
                            >
                              {isLogin ? "Email или логин" : "Email"}
                            </motion.label>
                          </div>
                          {!isLogin && (
                            <div className="relative">
                              <motion.input
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none transition-all interactive"
                                placeholder=" "
                              />
                              <motion.label
                                className={`absolute left-4 pointer-events-none transition-all bg-white px-1 ${
                                  formData.username ? 'top-0 text-xs text-brand-600' : 'top-3 text-gray-500'
                                }`}
                                animate={{
                                  y: formData.username ? -12 : 0,
                                }}
                              >
                                Имя пользователя
                              </motion.label>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeStep === 1 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="relative">
                            <motion.input
                              type="password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none transition-all interactive"
                              placeholder=" "
                            />
                            <motion.label
                              className={`absolute left-4 pointer-events-none transition-all bg-white px-1 ${
                                formData.password ? 'top-0 text-xs text-brand-600' : 'top-3 text-gray-500'
                              }`}
                              animate={{
                                y: formData.password ? -12 : 0,
                              }}
                            >
                              Пароль
                            </motion.label>
                          </div>
                          {!isLogin && (
                            <div className="relative">
                              <motion.input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none transition-all interactive"
                                placeholder=" "
                              />
                              <motion.label
                                className={`absolute left-4 pointer-events-none transition-all bg-white px-1 ${
                                  formData.confirmPassword ? 'top-0 text-xs text-brand-600' : 'top-3 text-gray-500'
                                }`}
                                animate={{
                                  y: formData.confirmPassword ? -12 : 0,
                                }}
                              >
                                Подтвердите пароль
                              </motion.label>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeStep === 2 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="text-center space-y-6"
                        >
                          <div className="w-16 h-16 mx-auto bg-brand-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✨</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Персонализация</h3>
                            <p className="text-gray-600 text-sm">
                              Ваш опыт будет адаптирован под ваши предпочтения
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between pt-4">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-6 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm interactive ${
                          activeStep === 0 ? 'invisible' : ''
                        }`}
                      >
                        Назад
                      </motion.button>

                      {activeStep < 2 ? (
                        <motion.button
                          type="button"
                          onClick={nextStep}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-2 bg-brand-600 text-white rounded-xl text-sm hover:bg-brand-700 transition-colors interactive"
                        >
                          Далее
                        </motion.button>
                      ) : (
                        <motion.button
                          type="submit"
                          disabled={isLoading}
                          whileHover={{ scale: isLoading ? 1 : 1.02 }}
                          whileTap={{ scale: isLoading ? 1 : 0.98 }}
                          className="px-8 py-2 bg-brand-600 text-white rounded-xl text-sm hover:bg-brand-700 transition-colors disabled:opacity-50 interactive"
                        >
                          {isLoading ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            isLogin ? 'Войти' : 'Создать аккаунт'
                          )}
                        </motion.button>
                      )}
                    </div>
                  </form>
                </motion.div>

                <div className="text-center space-y-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-brand-600 hover:text-brand-700 transition-colors font-medium interactive"
                  >
                    {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors interactive"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;