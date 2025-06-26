import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  Archive as ArchiveIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "@/shared/themeContext/ThemeContext";
import { useAuth } from "@/widgets/AuthForm/model/useAuth";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/shared/redux/store";
import { toggleVoiceInput } from "@/shared/redux/slices/voiceSlice";
import type { SelectChangeEvent } from "@mui/material/Select";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: "Общее", icon: <SettingsIcon /> },
  { text: "Аккаунт", icon: <LogoutIcon /> },
  { text: "Безопасность", icon: <SecurityIcon /> },
  { text: "О программе", icon: <InfoIcon /> },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onClose }) => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const theme = useTheme();

  const isVoiceInputEnabled = useSelector(
    (state: RootState) => state.voice.isVoiceInputEnabled
  );
  const themeModeRedux = useSelector((state: RootState) => state.theme.mode);
  const [themeMode, setThemeMode] = useState(themeModeRedux);
  const [language, setLanguage] = useState("ru");

  const [selected, setSelected] = useState("Общее");

  const handleThemeChange = (e: SelectChangeEvent<"light" | "dark">) => {
    const newMode = e.target.value as "light" | "dark";
    setThemeMode(newMode);
    if (newMode !== themeModeRedux) {
      toggleColorMode();
    }
  };

  const renderGeneralSettings = () => (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Общие настройки
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: theme.palette.text.secondary }}
      >
        Настройте общие параметры приложения
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography>Тема</Typography>
        <Select
          value={themeMode}
          onChange={handleThemeChange}
          size="small"
          sx={{
            minWidth: 100,
          }}
        >
          <MenuItem value="dark">Тёмная</MenuItem>
          <MenuItem value="light">Светлая</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography>Язык</Typography>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="ru">Русский</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography>Голосовой ввод</Typography>
        <Switch
          checked={isVoiceInputEnabled}
          onChange={() => dispatch(toggleVoiceInput())}
        />
      </Box>
    </>
  );

  const renderSecuritySettings = () => (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Безопасность
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: theme.palette.text.secondary }}
      >
        Настройте пароли, двухфакторную аутентификацию и другие меры
        безопасности
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
    </>
  );

  const renderAboutInfo = () => (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        О программе
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: theme.palette.text.secondary }}
      >
        Информация о версии, разработчиках
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
      <Box>
        <Typography>Версия: 1.2.6</Typography>
        <Typography>
          Разработчики: Балахадзе А.Г Назаренко П.Е Хакимов Р.Э
        </Typography>
      </Box>
    </>
  );

  const renderSessionSettings = () => (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Сессия
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: theme.palette.text.secondary }}
      >
        Управляйте текущей сессией, выходом из учётной записи и очисткой данных.
      </Typography>
      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
      <Box>
        <Typography>Выйти на этом устройстве</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={() => {
            logout();
          }}
        >
          Выйти
        </Button>
      </Box>
    </>
  );

  const renderContent = () => {
    switch (selected) {
      case "Общее":
        return renderGeneralSettings();
      case "Безопасность":
        return renderSecuritySettings();
      case "О программе":
        return renderAboutInfo();
      case "Аккаунт":
        return renderSessionSettings();
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        Настройки
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, backgroundColor: theme.palette.background.default }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <Box
            sx={{
              width: "14vw",
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          >
            <List>
              {menuItems.map(({ text, icon }) => (
                <ListItemButton
                  key={text}
                  selected={text === selected}
                  onClick={() => setSelected(text)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&.Mui-selected": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.grey[800]
                          : theme.palette.grey[200],
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        text === selected
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              height: "55vh", // увеличена высота модального контента
              px: 2,
              color: theme.palette.text.primary,
              overflowY: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                width: 8,
                backgroundColor: theme.palette.background.paper,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#444654" : "#b3b3b3",
                borderRadius: 4,
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#303030" : "#a0a0a0",
              },
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: theme.palette.background.default }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.primary }}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsPanel;
