import { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { IoMdMicOff, IoMdMic } from "react-icons/io";
import OfflineVoiceInput from "@/widgets/VoiceInput/model/OfflineVoiceInput";
import { useSelector } from "react-redux";
import { RootState } from "@/shared/redux/store";
import { useTheme } from "@mui/material/styles";

interface ControlPanelProps {
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  isLoadingSearch: boolean;
  setIsLoadingSearch: Dispatch<SetStateAction<boolean>>;
  isLoadingVoice: boolean;
  setIsLoadingVoice: Dispatch<SetStateAction<boolean>>;
  searchType: string;
  setSearchType: Dispatch<SetStateAction<string>>;
  sendMessage: () => void;
  mode: "light" | "dark";
}

export default function ControlPanel({
  newMessage,
  setNewMessage,
  handleKeyDown,
  isLoadingSearch,
  setIsLoadingSearch,
  isLoadingVoice,
  setIsLoadingVoice,
  searchType,
  setSearchType,
  sendMessage,
  mode,
}: ControlPanelProps) {
  const [listening, setListening] = useState<boolean>(false);
  const theme = useTheme();

  const isVoiceInputEnabled = useSelector(
    (state: RootState) => state.voice.isVoiceInputEnabled
  );

  const safeSetNewMessage = (text: string) => {
    try {
      setNewMessage(text);
    } catch (err) {
      console.error("Ошибка обновления newMessage:", err);
    }
  };

  return (
    <>
      {isVoiceInputEnabled && (
        <OfflineVoiceInput
          onResult={(text) => {
            console.log("Получен результат распознавания:", text);
            safeSetNewMessage(text);
          }}
          listening={listening}
          setListening={setListening}
          setIsLoadingAnswer={setIsLoadingVoice}
        />
      )}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.palette.background.default,
          p: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* Текстовое поле */}
          <Box
            id="composer-background"
            sx={{
              display: "flex",
              flexDirection: "column",
              cursor: "text",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "24px",
              px: 2,
              py: 1,
              transition: "all 150ms ease-in-out",
              backgroundColor: theme.customColors.controlPanelBackground,
            }}
          >
            <TextField
              fullWidth
              multiline
              placeholder="Искать в хранилище"
              variant="standard"
              value={newMessage}
              onChange={(e) => safeSetNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoadingSearch}
              sx={{ maxHeight: "15vh", overflowY: "auto" }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  px: 0,
                  py: 0,
                  fontSize: "1.1rem",
                  color: theme.palette.text.primary,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: 1,
                mr: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <InputLabel>Тип поиска</InputLabel>
                <Select
                  label="Тип поиска"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={isLoadingSearch}
                >
                  <MenuItem value="1">Гибридный поиск (alpha: 0.7)</MenuItem>
                  <MenuItem value="2">
                    Семантический (по сходству векторов)
                  </MenuItem>
                  <MenuItem value="3">Ключевые слова</MenuItem>
                </Select>
              </FormControl>

              {isVoiceInputEnabled && (
                <Button
                  onClick={() => setListening((prev) => !prev)}
                  variant={listening ? "outlined" : "contained"}
                  color={listening ? "error" : "primary"}
                >
                  {isLoadingVoice ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : listening ? (
                    <IoMdMicOff size={24} color="inherit" />
                  ) : (
                    <IoMdMic size={24} color="inherit" />
                  )}
                </Button>
              )}
            </Box>

            <Button
              onClick={sendMessage}
              disabled={newMessage.trim() === "" || isLoadingSearch}
              variant="contained"
              size="medium"
            >
              {isLoadingSearch ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Поиск"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
