# Recurring Tasks & Notifications Feature

## Overview

The Recurring Tasks & Notifications feature allows users to create tasks that repeat on a schedule (daily, weekly, monthly, etc.) and receive advance notifications before each task is due. This is perfect for habits, recurring chores, and routine activities.

## Table of Contents

1. [Features](#features)
2. [Data Structure](#data-structure)
3. [How It Works](#how-it-works)
4. [User Interface](#user-interface)
5. [Configuration Options](#configuration-options)
6. [Auto-Recurrence Logic](#auto-recurrence-logic)
7. [Notification System](#notification-system)
8. [Technical Implementation](#technical-implementation)
9. [Usage Examples](#usage-examples)

---

## Features

✅ **Multiple Recurrence Types**
- Daily: Task repeats every day
- Weekly: Task repeats every 7 days
- Bi-weekly: Task repeats every 14 days
- Monthly: Task repeats on the same day each month
- Yearly: Task repeats on the same day each year
- Custom: Task repeats every X days (user-defined)

✅ **Advance Notifications**
- User can configure when to be notified before task starts
- Flexible time units: minutes, hours, days
- Example: "Notify me 30 minutes before", "Notify me 1 day before"
- System checks automatically every 5 minutes

✅ **Automatic Recurrence**
- When user marks a recurring task as done, the next occurrence is automatically created
- Next task inherits same recurrence settings
- User can continue the pattern without manual re-creation

✅ **Visual Indicators**
- 🔄 Badge shows recurrence type (Diário/Semanal/Quinzenal/Mensal/Anual/Customizado)
- 🔔 Badge shows notification timing (e.g., "30 min antes", "1 h antes", "2 dias antes")
- Next occurrence date displayed on task card

---

## Data Structure

Each recurring task stores the following fields in Firestore:

```javascript
{
  // Standard task fields
  name: "Daily Exercise",
  location: "Gym",
  date: "2024-01-15",           // Current/original task date
  time: "06:30",                // Task time (optional)
  priority: "high",             // 1-5
  visibility: "privada",        // privada or publica
  description: "Morning workout",
  done: false,
  
  // Recurrence fields
  recurrence: "daily",          // daily|weekly|biweekly|monthly|yearly|custom|none
  customDays: 3,                // Only used when recurrence === 'custom'
  isRecurrent: true,            // Boolean flag for quick filtering
  nextDate: "2024-01-16",       // Date of next occurrence (YYYY-MM-DD)
  
  // Notification fields
  notificationTime: 30,         // How far in advance to notify (0 = no notification)
  notificationUnit: "minutes",  // minutes|hours|days
  notificationSent: false,      // Flag to prevent duplicate notifications
  
  // System fields
  createdAt: Timestamp,
  updatedAt: Timestamp (optional)
}
```

### Recurrence Values

| Value | Display | Schedule |
|-------|---------|----------|
| `none` | - | Non-recurring task |
| `daily` | 🔄 Diário | Every day |
| `weekly` | 🔄 Semanal | Every 7 days |
| `biweekly` | 🔄 Quinzenal | Every 14 days |
| `monthly` | 🔄 Mensal | Every month (same day) |
| `yearly` | 🔄 Anual | Every year (same day) |
| `custom` | 🔄 Customizado | Every X days |

---

## How It Works

### 1. User Creates a Recurring Task

```
User fills task form:
  ├─ Task name: "Daily Exercise"
  ├─ Date: January 15, 2024
  ├─ Recurrence: "Daily"
  ├─ Notification: "30 minutes before"
  └─ Other fields...
       ↓
System calculates nextDate:
  └─ Adds 1 day → January 16, 2024
       ↓
Task saved to Firestore with:
  - isRecurrent: true
  - nextDate: "2024-01-16"
  - recurrence: "daily"
  - notificationTime: 30
  - notificationUnit: "minutes"
```

### 2. Notification System Checks Every 5 Minutes

```
checkAndNotifyUpcomingTasks() runs every 5 minutes:
  ├─ Query all tasks with notificationTime > 0
  ├─ For each task:
  │  ├─ Calculate when notification should fire
  │  │  └─ Notification time = task.date/time - notification offset
  │  ├─ Compare with current time
  │  └─ If time has arrived and not yet sent:
  │     ├─ Create notification document
  │     ├─ Set notificationSent: true on task
  │     └─ Display alert to user (if desired)
```

### 3. User Completes a Recurring Task

```
User clicks checkbox on "Daily Exercise" task:
       ↓
System updates task: done = true
       ↓
If task.isRecurrent === true:
  ├─ Create NEW task with:
  │  ├─ Same name, location, time, priority, visibility
  │  ├─ Same recurrence settings
  │  ├─ date = nextDate from original task
  │  ├─ nextDate = calculated next date
  │  ├─ notificationTime/Unit = same as original
  │  └─ done: false
  │       ↓
  └─ Display new task in list immediately
```

---

## User Interface

### Task Creation Form Fields

The task form includes new fields for recurrence configuration:

```html
<!-- Recurrence Selection -->
<label for="task-recurrence">Recorrência:</label>
<select id="task-recurrence" class="form-select">
  <option value="none">Sem recorrência</option>
  <option value="daily">Diariamente</option>
  <option value="weekly">Semanalmente</option>
  <option value="biweekly">Quinzenalmente</option>
  <option value="monthly">Mensalmente</option>
  <option value="yearly">Anualmente</option>
  <option value="custom">Personalizado (a cada X dias)</option>
</select>

<!-- Custom Days Input (shown only if "custom" selected) -->
<input 
  id="task-custom-days" 
  type="number" 
  min="1" 
  placeholder="Dias entre repetições"
  style="display: none;"
>

<!-- Notification Timing -->
<label for="task-notification-time">Notificar:</label>
<input 
  id="task-notification-time" 
  type="number" 
  min="0" 
  value="0" 
  placeholder="Tempo"
>

<select id="task-notification-unit">
  <option value="minutes">Minutos antes</option>
  <option value="hours">Horas antes</option>
  <option value="days">Dias antes</option>
</select>
```

### Task Display

Recurring tasks show visual indicators:

```
┌─────────────────────────────────────────┐
│ Daily Exercise         🔄 Diário 🔔 30m │
│ 📍 Gym                                   │
│ 📅 Jan 15, 2024 at 06:30 AM             │
│ ℹ️ Morning workout                       │
│ 🔄 Próxima: 16 de jan. de 2024         │
│                                    [🗑] │
└─────────────────────────────────────────┘
```

---

## Configuration Options

### Recurrence Configuration

Users choose from 6 preset options + 1 custom option:

| Option | Best For |
|--------|----------|
| Daily | Medications, exercises, journaling |
| Weekly | Grocery shopping, laundry |
| Bi-weekly | Haircuts, deep cleaning |
| Monthly | Bill payments, car maintenance |
| Yearly | Birthdays, anniversaries |
| Custom | Any pattern (e.g., every 3 days) |

### Notification Configuration

Users can set 0 notifications or configure advance notice:

| Example | Use Case |
|---------|----------|
| 0 minutes | No notification (manual checking) |
| 15 minutes | Short reminder before starting |
| 1 hour | Time to prepare |
| 2 hours | Advance planning |
| 1 day | Remember to do it tomorrow |
| 3 days | Long-term planning |

---

## Auto-Recurrence Logic

### When Next Task is Created

The system automatically creates the next occurrence when you complete a recurring task:

**Event:** User marks task as done
```
Original Task:
  - date: "2024-01-15"
  - time: "06:30"
  - recurrence: "daily"
  - nextDate: "2024-01-16"
       ↓
Next Task Auto-Created:
  - date: "2024-01-16"          ← Uses nextDate from original
  - time: "06:30"               ← Same time
  - recurrence: "daily"         ← Same recurrence
  - nextDate: "2024-01-17"      ← Calculated for next occurrence
  - done: false
  - notificationTime: 30        ← Same notification settings
  - notificationUnit: "minutes"
```

### Calculating Next Date

The `calculateNextDate()` function handles date math for all recurrence types:

```javascript
// Daily: Add 1 day
// Weekly: Add 7 days
// Bi-weekly: Add 14 days
// Monthly: Add 1 month (same day)
// Yearly: Add 1 year (same day)
// Custom: Add X days (user-specified)
```

**Example: Monthly Task**
```
Original date: January 15, 2024
Recurrence: Monthly
Next date: February 15, 2024 (not 1 day + 1 month)
```

---

## Notification System

### Notification Timing Logic

Notifications trigger based on task start time and configured advance notice:

```
Task:
  - Date: January 15, 2024
  - Time: 06:30 AM
  - Notification: 30 minutes before

Notification should fire: 06:00 AM (06:30 - 30 min)
```

### Notification Calculation

```javascript
// 1. Get task's datetime
const taskTime = new Date(task.date + 'T' + task.time);

// 2. Convert notification offset to milliseconds
// Example: 30 minutes = 30 * 60 * 1000
const offset = convertToMilliseconds(task.notificationTime, task.notificationUnit);

// 3. Calculate notification trigger time
const notificationTime = taskTime - offset;

// 4. Compare with current time
if (currentTime >= notificationTime && !task.notificationSent) {
  // Send notification
}
```

### Notification Frequency

The system checks every 5 minutes:
- `checkAndNotifyUpcomingTasks()` runs every 5 minutes
- Prevents duplicate notifications with `notificationSent` flag
- Flag is reset when task recurs (new task has `notificationSent: false`)

---

## Technical Implementation

### Key Functions

#### 1. `calculateNextDate(currentDate, recurrence, customDays)`

```javascript
function calculateNextDate(currentDate, recurrence, customDays = null) {
  const date = new Date(currentDate);
  
  switch(recurrence) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'custom':
      if (customDays) {
        date.setDate(date.getDate() + customDays);
      }
      break;
  }
  
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}
```

**Parameters:**
- `currentDate` (Date|String): Starting date
- `recurrence` (String): Recurrence type
- `customDays` (Number, optional): Days for custom recurrence

**Returns:** Next occurrence date in YYYY-MM-DD format

---

#### 2. `checkAndNotifyUpcomingTasks(uid)`

```javascript
async function checkAndNotifyUpcomingTasks(uid) {
  try {
    const tasksRef = query(
      collection(db, 'users', uid, 'tasks'),
      where('notificationTime', '>', 0)
    );
    
    const tasksSnap = await getDocs(tasksRef);
    
    tasksSnap.forEach(async (docSnap) => {
      const task = docSnap.data();
      
      // Skip if notification already sent
      if (task.notificationSent) return;
      
      // Skip if no date
      if (!task.date) return;
      
      // Calculate notification trigger time
      const taskTime = new Date(task.date + 'T' + (task.time || '00:00'));
      let offset = task.notificationTime;
      
      switch(task.notificationUnit) {
        case 'hours':
          offset *= 60 * 60 * 1000;
          break;
        case 'days':
          offset *= 24 * 60 * 60 * 1000;
          break;
        default: // minutes
          offset *= 60 * 1000;
      }
      
      const notificationTime = new Date(taskTime - offset);
      const now = new Date();
      
      // If notification time has arrived
      if (now >= notificationTime && !task.notificationSent) {
        // Create notification
        await addDoc(collection(db, 'users', uid, 'notifications'), {
          taskName: task.name,
          taskId: docSnap.id,
          message: `Tarefa: ${task.name}`,
          createdAt: serverTimestamp(),
          read: false,
          type: 'task_reminder'
        });
        
        // Mark notification as sent
        await updateDoc(
          doc(db, 'users', uid, 'tasks', docSnap.id),
          { notificationSent: true }
        );
      }
    });
  } catch (err) {
    console.error('Erro ao verificar notificações:', err);
  }
}
```

**Logic:**
1. Query all tasks with `notificationTime > 0`
2. For each task, calculate notification trigger time
3. Convert notification offset based on unit (minutes/hours/days)
4. Compare notification time with current time
5. If time has arrived and not yet sent:
   - Create notification document
   - Mark task as `notificationSent: true`

---

#### 3. `startRecurrenceChecker(uid)`

```javascript
function startRecurrenceChecker(uid) {
  // Check immediately
  checkAndNotifyUpcomingTasks(uid);
  
  // Then check every 5 minutes
  setInterval(() => {
    checkAndNotifyUpcomingTasks(uid);
  }, 5 * 60 * 1000); // 5 minutes in milliseconds
}
```

**Purpose:** Initialize and maintain recurring checks for notifications

**Called:** In `onAuthStateChanged()` when user logs in

---

#### 4. Task Form Submit Handler (Updated)

The task form now captures recurrence and notification fields:

```javascript
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = taskName.value.trim();
  const location = taskLocation.value.trim();
  const date = taskDate.value;
  const time = taskTime.value;
  const priority = taskPriority.value;
  const visibility = taskVisibility.value;
  const description = taskDescription.value.trim();
  const recurrence = taskRecurrence.value;
  const customDays = parseInt(taskCustomDays.value) || null;
  const notificationTime = parseInt(taskNotificationTime.value) || 0;
  const notificationUnit = taskNotificationUnit.value;
  
  const user = auth.currentUser;
  if (!user || !name) {
    showAlert(taskAlert, 'Digite um nome para a tarefa');
    return;
  }
  
  // Validate custom days if needed
  if (recurrence === 'custom' && (!customDays || customDays < 1)) {
    showAlert(taskAlert, 'Digite uma quantidade válida de dias');
    return;
  }
  
  try {
    // Calculate next date for recurring tasks
    let nextDate = date;
    if (recurrence !== 'none' && date) {
      nextDate = calculateNextDate(date, recurrence, customDays);
    }
    
    // Save to Firestore
    await addDoc(collection(db, 'users', user.uid, 'tasks'), {
      name,
      location,
      date,
      time,
      priority,
      visibility,
      description,
      recurrence,
      customDays,
      notificationTime,
      notificationUnit,
      nextDate,
      done: false,
      isRecurrent: recurrence !== 'none',
      createdAt: serverTimestamp()
    });
    
    // Notify friends if public
    if (visibility === 'publica') {
      await createNotificationForFriends(user.uid, name);
    }
    
    taskForm.reset();
    showAlert(taskSuccess, 'Tarefa adicionada com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar tarefa:', err);
    showAlert(taskAlert, 'Erro ao adicionar: ' + err.message);
  }
});
```

---

#### 5. Task Toggle Handler (Updated)

When user marks a task as complete, the system auto-creates the next occurrence:

```javascript
taskList.addEventListener('click', async (e) => {
  // ... [other code] ...
  
  if (action === 'toggle') {
    const docSnap = await getDoc(ref);
    const current = docSnap.data();
    
    // If task is being marked as done AND is recurring
    if (!current.done && current.isRecurrent) {
      // Create next occurrence automatically
      const nextDate = calculateNextDate(
        current.nextDate || current.date,
        current.recurrence,
        current.customDays
      );
      
      await addDoc(
        collection(db, 'users', user.uid, 'tasks'),
        {
          name: current.name,
          location: current.location,
          date: current.nextDate || current.date,
          time: current.time,
          priority: current.priority,
          visibility: current.visibility,
          description: current.description,
          recurrence: current.recurrence,
          customDays: current.customDays,
          notificationTime: current.notificationTime,
          notificationUnit: current.notificationUnit,
          nextDate,
          done: false,
          isRecurrent: true,
          createdAt: serverTimestamp()
        }
      );
    }
    
    // Mark original as done
    await updateDoc(ref, { done: !current.done });
  }
});
```

---

### HTML/CSS Implementation

#### Form Fields (index.html)

```html
<div class="mb-3">
  <label for="task-recurrence" class="form-label">Recorrência:</label>
  <select id="task-recurrence" class="form-select">
    <option value="none">Sem recorrência</option>
    <option value="daily">Diariamente</option>
    <option value="weekly">Semanalmente</option>
    <option value="biweekly">Quinzenalmente</option>
    <option value="monthly">Mensalmente</option>
    <option value="yearly">Anualmente</option>
    <option value="custom">Personalizado (a cada X dias)</option>
  </select>
</div>

<div id="custom-days-wrapper" class="mb-3" style="display: none;">
  <input
    id="task-custom-days"
    type="number"
    class="form-control"
    min="1"
    placeholder="Dias entre repetições"
  >
</div>

<div class="mb-3 d-flex gap-2">
  <div class="flex-grow-1">
    <label for="task-notification-time" class="form-label">Notificar:</label>
    <input
      id="task-notification-time"
      type="number"
      class="form-control"
      min="0"
      value="0"
      placeholder="Tempo"
    >
  </div>
  <div class="flex-grow-1">
    <label for="task-notification-unit" class="form-label">Unidade:</label>
    <select id="task-notification-unit" class="form-select">
      <option value="minutes">Minutos antes</option>
      <option value="hours">Horas antes</option>
      <option value="days">Dias antes</option>
    </select>
  </div>
</div>

<script>
  const taskRecurrence = document.getElementById('task-recurrence');
  const customDaysWrapper = document.getElementById('custom-days-wrapper');
  const taskCustomDays = document.getElementById('task-custom-days');
  
  taskRecurrence.addEventListener('change', () => {
    customDaysWrapper.style.display = 
      taskRecurrence.value === 'custom' ? 'block' : 'none';
  });
</script>
```

#### Task Display Updates

Task cards now include recurrence and notification badges:

```html
<div class="d-flex justify-content-between align-items-start">
  <div>
    <h6 class="mb-2">
      ${data.name}
      ${recurrenceBadge}  <!-- 🔄 Diário, etc. -->
      ${notificationBadge} <!-- 🔔 30 min antes, etc. -->
    </h6>
    <!-- Task details... -->
    ${data.nextDate && data.isRecurrent ? 
      `<div><i class="bi bi-arrow-repeat"></i> <small>Próxima: ${new Date(data.nextDate).toLocaleDateString('pt-BR')}</small></div>` 
      : ''}
  </div>
  <!-- Action buttons... -->
</div>
```

---

## Usage Examples

### Example 1: Daily Morning Exercise

```
User creates task:
- Name: "Morning Exercise"
- Date: January 15, 2024
- Time: 06:30 AM
- Recurrence: Daily
- Notification: 30 minutes before

Results:
✅ Task created with nextDate: January 16, 2024
✅ Notification scheduled for 06:00 AM
✅ When completed, next task auto-created for Jan 16, 2024
✅ Pattern continues indefinitely
```

### Example 2: Weekly Grocery Shopping

```
User creates task:
- Name: "Grocery Shopping"
- Date: Saturday, January 13, 2024
- Recurrence: Weekly
- Notification: 1 day before

Results:
✅ Task scheduled for Saturday
✅ Notification fires Friday
✅ Each Saturday, new task auto-created
✅ Shopping reminder appears Friday every week
```

### Example 3: Custom Medication Reminder

```
User creates task:
- Name: "Take Medication"
- Date: January 15, 2024
- Time: 08:00 AM
- Recurrence: Custom (every 12 days)
- Notification: 1 hour before

Results:
✅ Takes medication every 12 days
✅ Reminder at 7:00 AM
✅ Auto-creates next occurrence every 12 days
✅ Perfect for medicines with longer intervals
```

### Example 4: No Notification

```
User creates task:
- Name: "Check Email"
- Recurrence: Daily
- Notification: 0 minutes (no notification)

Results:
✅ Task repeats daily
✅ No automatic reminders sent
✅ User checks manually when ready
✅ Still auto-creates next occurrence
```

---

## Firestore Query Examples

### Get All Recurring Tasks for User

```javascript
const q = query(
  collection(db, 'users', userId, 'tasks'),
  where('isRecurrent', '==', true)
);
const snap = await getDocs(q);
```

### Get Tasks Needing Notifications

```javascript
const q = query(
  collection(db, 'users', userId, 'tasks'),
  where('notificationTime', '>', 0),
  where('notificationSent', '==', false)
);
const snap = await getDocs(q);
```

### Get Upcoming Tasks (Next 7 Days)

```javascript
const today = new Date();
const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

const q = query(
  collection(db, 'users', userId, 'tasks'),
  where('date', '>=', today.toISOString().split('T')[0]),
  where('date', '<=', weekFromNow.toISOString().split('T')[0]),
  where('done', '==', false)
);
const snap = await getDocs(q);
```

---

## Best Practices

### For Users

1. **Start Simple**: Use preset recurrence types before custom intervals
2. **Set Appropriate Notifications**: 
   - Quick tasks: 15-30 minutes notice
   - Preparation tasks: 1-2 hours notice
   - Large tasks: 1 day notice
3. **Monitor Completed Tasks**: Check that next occurrences are being created correctly
4. **Use Descriptions**: Add context for recurring tasks ("Every Tuesday, bring lunch for kids")

### For Developers

1. **Date Handling**: Always use YYYY-MM-DD format for consistency
2. **Timezone Awareness**: Consider timezone differences when comparing times
3. **Notification Safety**: The `notificationSent` flag prevents duplicate notifications
4. **Query Efficiency**: Use `isRecurrent: true` to avoid querying non-recurring tasks
5. **Testing**: Create test accounts to verify recurrence patterns work correctly

---

## Troubleshooting

### Problem: Next Task Not Creating

**Possible Causes:**
1. `isRecurrent` flag is false - check task was created with recurrence !== 'none'
2. Toggle handler not triggered - ensure checkbox click works
3. Firestore write permissions - verify rules allow task creation

**Solution:**
```javascript
// Check in browser console
console.log('Task isRecurrent:', task.isRecurrent);
console.log('Task recurrence:', task.recurrence);
// Should both be set correctly
```

### Problem: Notification Not Firing

**Possible Causes:**
1. `checkAndNotifyUpcomingTasks()` not running - verify `startRecurrenceChecker()` was called
2. Date/time format incorrect - should be YYYY-MM-DD and HH:mm
3. Timezone mismatch - check system time
4. `notificationSent` flag already true - flag should reset on new task

**Solution:**
```javascript
// Check checker is running
console.log('Interval ID:', recurrenceCheckerId);
// Manually trigger check
checkAndNotifyUpcomingTasks(currentUser.uid);
```

### Problem: Recurrence Calculation Wrong

**Example Issue**: Monthly task on Jan 31 → Feb 31 (doesn't exist)

**Note**: JavaScript's `setMonth()` handles this correctly (rolls to next month), but be aware:
```javascript
const d = new Date('2024-01-31');
d.setMonth(d.getMonth() + 1);
// Result: February 29, 2024 (not March 3)
```

---

## Future Enhancements

Potential features for future versions:

- [ ] Pause/Resume recurring tasks
- [ ] End date for recurring tasks ("repeat until December 31")
- [ ] Recurring patterns (every 2nd Tuesday, weekdays only)
- [ ] Recurring task history/analytics
- [ ] Skip next occurrence feature
- [ ] Push/email notifications (in addition to in-app)
- [ ] Sync with calendar (iCal export)
- [ ] Notification preference per recurrence type

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2024 | Initial release with 6 recurrence types + notifications |

---

## Support

For issues or questions about recurring tasks:
1. Check this documentation
2. Review browser console for errors
3. Check Firestore rules allow read/write
4. Verify dates are in correct format (YYYY-MM-DD)

---

