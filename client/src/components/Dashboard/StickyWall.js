import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const StickyNote = ({ note, onDelete, onUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: 2,
        bgcolor: note.color || '#fff8e1',
        position: 'relative',
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <DragIcon
          sx={{
            cursor: 'grab',
            color: 'text.secondary',
            opacity: 0.5,
            '&:hover': { opacity: 1 },
          }}
        />
        <IconButton
          size={isMobile ? "small" : "medium"}
          onClick={() => onDelete(note.id)}
          sx={{ color: 'text.secondary' }}
        >
          <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
      <TextField
        multiline
        fullWidth
        variant="standard"
        value={note.content}
        onChange={(e) => onUpdate(note.id, e.target.value)}
        placeholder="Write your note here..."
        sx={{
          flexGrow: 1,
          '& .MuiInputBase-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
          },
          '& .MuiInputBase-input': {
            padding: 0,
          },
        }}
      />
    </Paper>
  );
};

const StickyWall = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [notes, setNotes] = useState([]);

  const handleAddNote = () => {
    const newNote = {
      id: uuidv4(),
      content: '',
      color: '#fff8e1',
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleUpdateNote = (id, content) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">Sticky Wall</Typography>
        <IconButton
          onClick={handleAddNote}
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <AddIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onDelete={handleDeleteNote}
            onUpdate={handleUpdateNote}
          />
        ))}
      </Box>
    </Box>
  );
};

export default StickyWall; 