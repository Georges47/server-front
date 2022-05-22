import {useEffect, useMemo, useState} from "react";
import {
  AppBar,
  Box,
  Button,
  createTheme, CssBaseline,
  Paper,
  Switch,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography
} from "@mui/material";
import { LightMode, DarkMode } from '@mui/icons-material';

const baseUrl = "http://localhost:8080";

function App({cableApp}) {
  // const [downloadUrl, setDownloadUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadMessages, setDownloadMessages] = useState([""]);
  const [filename, setFilename] = useState("");
  const [showDownloadProgress, setShowDownloadProgress] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const [paletteMode, setPaletteMode] = useState("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: paletteMode,
        },
      }),
    [paletteMode]
  );

  useEffect(() => {
    cableApp.cable.subscriptions.create({ channel: 'YoutubeDlChannel', name: 'youtube_dl_channel' },
      {
        received: (message) => {
          if(message.includes("[link]")) {
            setShowDownloadProgress(false);
            // setDownloadUrl(message.replace("[link]", ""));
            setShowDownloadButton(true);
          } else {
            setDownloadMessages(downloadMessages => [...downloadMessages, message])
          }
        }
      })
    console.log(cableApp);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box style={{height: "100%"}}>
        <AppBar position="static" style={{marginBottom: 20}}>
          <Toolbar>
            <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
              <LightMode />
              <Switch color="default" onChange={() => paletteMode === "light" ? setPaletteMode("dark") : setPaletteMode("light")}/>
              <DarkMode />
            </Box>
          </Toolbar>
        </AppBar>
        <Box style={{display: "flex", justifyContent: "center"}}>
            <Paper style={{padding: 0, display: "flex", flexDirection: "column"}}>
              <Box style={{
                padding: 5,
                margin: 20,
              }}>
                {
                  !downloadMessages[downloadMessages.length - 1].includes("[link]") &&
                  <Box>
                    <Typography style={{color: "#1976d2"}}> Ingresa el link del video </Typography>
                    <Box style={{
                      border: "1px #1976d2 solid",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                    }}>
                      <TextField
                        variant="standard"
                        required
                        onChange={(e) => {setVideoUrl(e.target.value)}}
                        InputProps={{ disableUnderline: true }}
                        inputProps={{
                          autoComplete: 'new-password',
                          form: {
                            autocomplete: 'off',
                          },
                        }}
                        sx={{ input: { color: "#1976d2" }}}
                        fullWidth
                        style={{
                          border: "none",
                          flex: 1,
                          marginLeft: 5
                        }}
                      />
                      <Button variant="contained" style={{margin: 5}} onClick={() => {
                        //setProcessing(true);
                        fetch(`${baseUrl}/youtube-dl/process?url=${videoUrl}`)
                          .then(response => response.json())
                          .then(
                            data => {
                              setShowDownloadProgress(true);
                              //setProcessing(false);
                              setFilename(data.filename)
                              setVideoTitle(data.title)
                            },
                            cause => console.log(cause))
                          .catch(error => {
                            console.log(error)
                          })
                      }}>
                        Procesar
                      </Button>
                    </Box>
                  </Box>
                }
                {
                  showDownloadProgress &&
                  <Box style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 10}}>
                    <Typography style={{color: "#1976d2"}}> Procesando: {downloadMessages[downloadMessages.length - 1]} </Typography>
                  </Box>
                }
                {
                  showDownloadButton &&
                  <Box style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 10}}>
                    <Typography style={{color: "#1976d2", marginBottom: 5, fontWeight: 'bold'}}> { videoTitle } </Typography>
                    <Button variant="contained" component="a" href={`${baseUrl}/song?filename=${filename}`}> Descargar </Button>
                  </Box>
                }
              </Box>
            </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
