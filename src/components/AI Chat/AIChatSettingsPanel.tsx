import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { LANGUAGES } from './constants';
import { SetSettings, UserSettings } from './types';

interface AIChatSettingsPanelProps {
  showSettings: boolean;
  settings: UserSettings;
  setSettings: SetSettings;
  isRecording: boolean;
  onToggleRecording: (checked: boolean) => void;
}

const AIChatSettingsPanel: React.FC<AIChatSettingsPanelProps> = ({
  showSettings,
  settings,
  setSettings,
  isRecording,
  onToggleRecording
}) => {
  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
            <CardContent className="p-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="voice">Voice</TabsTrigger>
                  <TabsTrigger value="language">Language</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Show Accuracy</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Display real-time accuracy feedback</p>
                    </div>
                    <Switch
                      checked={settings.showAccuracy}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, showAccuracy: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Auto Translate</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Translate responses automatically</p>
                    </div>
                    <Switch
                      checked={settings.autoTranslate}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, autoTranslate: checked }))
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Voice Responses</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">AI speaks responses aloud</p>
                    </div>
                    <Switch
                      checked={settings.voiceEnabled}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, voiceEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Voice Input</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Use voice to send messages</p>
                    </div>
                    <Switch
                      checked={isRecording}
                      onCheckedChange={onToggleRecording}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="language" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Language</label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="bg-white/70 dark:bg-slate-900/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <span aria-hidden="true">{lang.flag}</span>
                              <span>{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatSettingsPanel;
