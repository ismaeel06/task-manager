import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Checkbox,
  Paper,
  Typography,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
  Label as TagIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const TaskList = ({ tasks, onDeleteTask, onToggleComplete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <List sx={{ width: '100%', p: 0 }}>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            secondaryAction={
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: { xs: 0.5, sm: 1 }
                }}
              >
                {task.dueDate && (
                  <Typography
                    variant={isMobile ? "caption" : "body2"}
                    color="text.secondary"
                    sx={{ 
                      mr: { xs: 1, sm: 2 },
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {format(new Date(task.dueDate), 'MM-dd-yy')}
                  </Typography>
                )}
                {task.tag && (
                  <Chip
                    icon={<TagIcon sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />}
                    label={task.tag}
                    size="small"
                    sx={{ 
                      mr: { xs: 1, sm: 2 },
                      display: { xs: 'none', sm: 'block' },
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                    }}
                  />
                )}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDeleteTask(task._id)}
                  size={isMobile ? "small" : "medium"}
                >
                  <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="details"
                  size={isMobile ? "small" : "medium"}
                >
                  <ChevronRightIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Box>
            }
            disablePadding
            sx={{
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 1 },
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={task.completed}
                onChange={() => onToggleComplete(task._id)}
                size={isMobile ? "small" : "medium"}
              />
            </ListItemIcon>
            <ListItemText
              primary={task.title}
              primaryTypographyProps={{
                variant: isMobile ? "body2" : "body1",
                sx: {
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary',
                }
              }}
              secondary={
                isMobile ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {task.dueDate && (
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(task.dueDate), 'MM-dd-yy')}
                      </Typography>
                    )}
                    {task.tag && (
                      <Chip
                        icon={<TagIcon sx={{ fontSize: '0.7rem' }} />}
                        label={task.tag}
                        size="small"
                        sx={{ 
                          height: 20,
                          '& .MuiChip-label': {
                            fontSize: '0.7rem',
                            px: 1,
                          }
                        }}
                      />
                    )}
                  </Box>
                ) : null
              }
            />
          </ListItem>
        ))}
        {tasks.length === 0 && (
          <ListItem
            sx={{
              py: { xs: 3, sm: 4 },
              px: { xs: 2, sm: 3 }
            }}
          >
            <ListItemText
              primary="No tasks yet"
              primaryTypographyProps={{
                variant: isMobile ? "body2" : "body1",
                align: "center",
                color: "text.secondary"
              }}
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default TaskList; 