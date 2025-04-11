import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Chip,
  useTheme,
  useMediaQuery,
  Collapse,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Checklist as TodayIcon,
  KeyboardDoubleArrowRight as UpcomingIcon,
  CalendarMonth as CalendarIcon,
  StickyNote2 as BookmarkIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Label as TagIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import StickyWall from './StickyWall';
import axios from 'axios';
import { isToday, isAfter, startOfDay, endOfDay } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const drawerWidth = 240;
const AVAILABLE_TAGS = ['Personal', 'Work', 'Shopping', 'Health', 'Family'];

const Dashboard = () => {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedList, setSelectedList] = useState('Today');
  const [tasks, setTasks] = useState([]);
  const [tagsOpen, setTagsOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        task,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const task = tasks.find(t => t._id === taskId);
      const response = await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}`,
        { completed: !task.completed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.map(t => t._id === taskId ? response.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filteredTasks = useMemo(() => {
    if (selectedList === 'Today') {
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return isToday(taskDate);
      });
    }
    
    if (selectedList === 'Upcoming') {
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return isAfter(taskDate, endOfDay(new Date()));
      });
    }
    
    if (selectedList === 'Calendar') {
      return tasks;
    }
    
    if (selectedList === 'Sticky Wall') {
      return tasks;
    }
    
    if (AVAILABLE_TAGS.includes(selectedList)) {
      return tasks.filter(task => task.tag === selectedList);
    }
    
    return tasks;
  }, [tasks, selectedList]);

  const getTaskCount = (list) => {
    if (list === 'Today') {
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return isToday(taskDate);
      }).length;
    }
    
    if (list === 'Upcoming') {
      return tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return isAfter(taskDate, endOfDay(new Date()));
      }).length;
    }
    
    if (AVAILABLE_TAGS.includes(list)) {
      return tasks.filter(task => task.tag === list).length;
    }
    
    return tasks.length;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListSelect = (text) => {
    setSelectedList(text);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const lists = [
    { text: 'Upcoming', icon: <UpcomingIcon />, count: getTaskCount('Upcoming') },
    { text: 'Today', icon: <TodayIcon />, count: getTaskCount('Today') },
    { text: 'Calendar', icon: <CalendarIcon /> },
    { text: 'Sticky Wall', icon: <BookmarkIcon /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search"
          variant="outlined"
        />
      </Box>
      <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
        TASKS
      </Typography>
      <List sx={{ flexGrow: 1 }}>
        {lists.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={selectedList === item.text}
            onClick={() => handleListSelect(item.text)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            {item.count > 0 && (
              <Chip
                size="small"
                label={item.count}
                sx={{ ml: 1 }}
              />
            )}
          </ListItem>
        ))}
        
        <ListItem button onClick={() => setTagsOpen(!tagsOpen)}>
          <ListItemIcon>
            <TagIcon />
          </ListItemIcon>
          <ListItemText primary="Tags" />
          {tagsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        
        <Collapse in={tagsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {AVAILABLE_TAGS.map((tag) => {
              const taskCount = tasks.filter(task => task.tag === tag).length;
              return (
                <ListItem
                  button
                  key={tag}
                  selected={selectedList === tag}
                  onClick={() => handleListSelect(tag)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <TagIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={tag}
                    primaryTypographyProps={{
                      variant: 'body2',
                    }}
                  />
                  {taskCount > 0 && (
                    <Chip
                      size="small"
                      label={taskCount}
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  const renderContent = () => {
    if (selectedList === 'Calendar') {
      return (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              sx={{
                width: '100%',
                maxWidth: '400px',
                mx: 'auto',
                '& .MuiPickersCalendarHeader-root': {
                  mt: 0,
                },
              }}
            />
          </LocalizationProvider>
        </Paper>
      );
    }

    if (selectedList === 'Sticky Wall') {
      return <StickyWall />;
    }

    return (
      <>
        <TaskForm onAddTask={handleAddTask} />
        <TaskList
          tasks={filteredTasks}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {selectedList}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 