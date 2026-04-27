import { useState } from 'react';
import Layout from './components/layout/Layout';
import LandingPage from './components/features/LandingPage';
import QuizController from './components/features/QuizController';
import ResultsDashboard from './components/features/ResultsDashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); 
  const [finalData, setFinalData] = useState(null);

  const handleQuizFinish = (answers) => {
    console.log("Respuestas finales:", answers);
    setFinalData(answers);
    setCurrentScreen('dashboard');
  };

  return (
    <>
      {currentScreen === 'landing' && (
        <Layout>
          <LandingPage onStart={() => setCurrentScreen('quiz')} />
        </Layout>
      )}
      
      {currentScreen === 'quiz' && (
        <QuizController 
          onFinish={handleQuizFinish} 
          onCancel={() => setCurrentScreen('landing')}
        />
      )}

      {currentScreen === 'dashboard' && (
        <Layout>
          <ResultsDashboard 
            answers={finalData} 
            onRestart={() => setCurrentScreen('landing')} 
          />
        </Layout>
      )}
    </>
  );
}