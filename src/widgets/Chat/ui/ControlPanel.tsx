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

export default function ControlPanel({
  newMessage,
  setNewMessage,
  handleKeyDown,
  isLoadingAnswer,
  searchType,
  setSearchType,
  sendMessage,
  mode,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  return (
    <>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "background",
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
              backgroundColor:
                mode === "dark" ? "#303030" : "background.default",
            }}
          >
            <TextField
              fullWidth
              multiline
              placeholder="Искать в хранилище"
              variant="standard"
              value={newMessage}
              onChange={(e: { target: { value: unknown } }) =>
                setNewMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={isLoadingAnswer}
              sx={{ maxHeight: "15vh", overflowY: "auto" }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  px: 0,
                  py: 0,
                  fontSize: "1.1rem",
                  color: mode === "dark" ? "#D1D5DB" : "#202123",
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
                  onChange={(e: { target: { value: unknown } }) =>
                    setSearchType(e.target.value)
                  }
                  disabled={isLoadingAnswer}
                >
                  <MenuItem value="1">Гибридный поиск (alpha: 0.7)</MenuItem>
                  <MenuItem value="2">
                    Поиск по сходству векторов (смысловой поиск)
                  </MenuItem>
                  <MenuItem value="3">Поиск по ключевым словам</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={sendMessage}
                disabled={newMessage.trim() === "" || isLoadingAnswer}
                variant="contained"
                size="medium"
              >
                {isLoadingAnswer ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Поиск"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
