import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AVAILABLE_TAGS = ['Personal', 'Work', 'Shopping', 'Health', 'Family'];

const TaskForm = ({ onAddTask }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [tag, setTag] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      tag: tag || undefined,
      completed: false,
    };

    onAddTask(newTask);
    setTitle('');
    setDueDate(null);
    setTag('');
    setIsExpanded(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        bgcolor: 'background.paper',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size={isMobile ? "small" : "medium"}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
            }}
          />
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: 'text.secondary',
              alignSelf: 'center',
            }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Button
            type="submit"
            variant="contained"
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: 'auto',
              px: { xs: 1, sm: 2 },
            }}
          >
            <AddIcon fontSize={isMobile ? "small" : "medium"} />
          </Button>
        </Box>

        {isExpanded && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Due Date"
                value={dueDate}
                onChange={setDueDate}
                slotProps={{
                  textField: {
                    size: isMobile ? "small" : "medium",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Tag</InputLabel>
              <Select
                value={tag}
                label="Tag"
                onChange={(e) => setTag(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {AVAILABLE_TAGS.map((tagOption) => (
                  <MenuItem key={tagOption} value={tagOption}>
                    {tagOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TaskForm; 