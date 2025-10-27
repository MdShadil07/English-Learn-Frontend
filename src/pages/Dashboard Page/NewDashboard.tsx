import { useState } from 'react';
import NewDashboardLayout from '@/components/dashboard/NewDashboardLayout';
import NewDashboardHome from '@/components/dashboard/NewDashboardHome';
import GrammarView from '@/components/dashboard/features/GrammarView';
import VocabularyView from '@/components/dashboard/features/VocabularyView';
import WritingView from '@/components/dashboard/features/WritingView';
import ReadingView from '@/components/dashboard/features/ReadingView';
import RoomsView from '@/components/dashboard/features/RoomsView';
import NotesView from '@/components/dashboard/features/NotesView';
import CommunityView from '@/components/dashboard/features/CommunityView';
import FocusModeView from '@/components/dashboard/features/FocusModeView';
import AIChat from '../../pages/AI Chat Page/AIChatPage';
import AIPractice from '@/components/dashboard/AIPractice';
import VoiceRooms from '@/components/dashboard/VoiceRooms';
import { useAuth } from '@/contexts/AuthContext';

const NewDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<string>('home');

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <NewDashboardHome />;
      case 'grammar':
        return <GrammarView />;
      case 'vocabulary':
        return <VocabularyView />;
      case 'writing':
        return <WritingView />;
      case 'reading':
        return <ReadingView />;
      case 'ai-chat':
        return <AIChat />;
      case 'ai-practice':
        return <AIPractice />;
      case 'rooms':
        return <RoomsView />;
      case 'voice-rooms':
        return <VoiceRooms />;
      case 'notes':
        return <NotesView />;
      case 'focus':
        return <FocusModeView />;
      case 'community':
        return <CommunityView />;
      case 'listening':
        return <ReadingView />; // Placeholder - create dedicated component later
      case 'speaking':
        return <AIPractice />; // Placeholder - create dedicated component later
      case 'ai-tutor':
        return <AIChat />; // Placeholder - create dedicated component later
      case 'bookmarks':
        return <NotesView />; // Placeholder - create dedicated component later
      case 'analytics':
        return <NewDashboardHome />; // Placeholder - create dedicated component later
      default:
        return <NewDashboardHome />;
    }
  };

  return (
    <NewDashboardLayout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </NewDashboardLayout>
  );
};

export default NewDashboard;
