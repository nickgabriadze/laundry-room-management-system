# 🧺 Laundry Management System (LRMS)

A modern, real-time laundry room management platform designed to help students efficiently manage shared laundry facilities in dormitories. Track machine availability, schedule sessions, and get reminders when your laundry is ready.

## ✨ Features

### Machine Management
- **Real-time Availability** - See which washers and dryers are available or currently in use
- **Machine Codes** - Each machine has a unique identifier (e.g., #WF1, #DE2) for easy reference
- **Building-Based Organization** - Filter machines by your dormitory building (Building E, F, or G)
- **Status Indicators** - Quick visual feedback on machine availability with intuitive icons

### Session Scheduling
- **Flexible Duration** - Set custom session times based on the machine's displayed cycle
  - **Washers**: 10-120 minutes
  - **Dryers**: 10+ minutes (no limit)
- **One Machine Per Type** - Prevent scheduling conflicts by allowing only one active session per machine type
- **Immediate Availability** - Machines become available instantly when sessions end (or are stopped)

### Smart Reminders
- **Email Notifications** - Receive automatic email reminders 10 minutes before your laundry cycle finishes
- **Prevents Forgotten Laundry** - No more leaving your clothes unattended in the machine
- **Reliable Scheduling** - Built-in retry logic ensures you don't miss reminders

### Previous User Information
- **Contact Details** - See who last used a machine (even if they cancelled early)
- **Finish Time** - Check when the previous session ended
- **Easy Communication** - Click to email the previous user about any forgotten items

### User Profile
- **Dormitory Assignment** - Register your building for relevant machine access
- **Flexible Updates** - Change your building assignment as needed
- **Personal History** - Track your laundry sessions

## 🎯 How It Works

### For Students

1. **Sign In** - Authenticate with your student account (Firebase)
2. **Set Building** - Choose your dormitory (Building E, F, or G)
3. **Browse Machines** - View all washers and dryers in your building
4. **Schedule Session** - Pick an available machine and enter the cycle time
5. **Get Reminder** - Receive an email 10 minutes before completion
6. **Retrieve Laundry** - Get your items when the cycle finishes

### If You Find Forgotten Laundry

1. **View Previous User** - Check who last used the machine
2. **Send Message** - Click their email to contact them
3. **Remind Them** - Let them know about their forgotten items

## 🏗️ Technology Overview

- **Frontend**: Next.js 16 with React 19 (TypeScript) - Modern web interface
- **Backend**: Firebase (Authentication & Data Connect) - Secure cloud backend
- **Database**: PostgreSQL via Firebase Data Connect - Reliable data storage
- **Email Service**: Resend - Reliable reminder notifications
- **Styling**: CSS Modules with Tailwind CSS - Responsive, fast loading
- **Real-time**: Firebase Data Connect Queries - Instant updates

## 📋 Machine Types

### Washers
- Cycle duration: 10-120 minutes
- Perfect for everyday laundry needs
- Multiple units per building for flexibility

### Dryers
- Cycle duration: 10+ minutes (flexible)
- Higher capacity for larger loads
- Available in all dormitory buildings

## 🏢 Supported Buildings

- **Building E** - Multiple washers and dryers
- **Building F** - Multiple washers and dryers
- **Building G** - Multiple washers and dryers

## 🔒 Privacy & Security

- **Authentication Required** - Only registered users can access the system
- **Limited Data Sharing** - Email addresses are only shown to other students already viewing the machine
- **Secure Sessions** - Firebase-backed authentication ensures account safety
- **Data Encryption** - All communications use HTTPS

## 💡 Best Practices

### Scheduling Tips
- **Check Display Times** - Set timer reminders on your phone for accurate cycle times
- **Avoid Peak Hours** - Schedule during quieter times for better machine availability
- **Be Punctual** - Retrieve your items promptly when done to not block others

### Courtesy Guidelines
- **Remove Items Quickly** - Don't leave laundry unattended after completion
- **Report Issues** - Contact administrators if a machine is broken or malfunctioning
- **Respect Schedule** - Honor the scheduled duration, don't extend sessions arbitrarily

## 📞 Support & FAQ

### Common Issues

**"Machine not available"**
- The machine may have just been taken by another student
- Refresh the page to see updated availability
- Try another machine of the same type

**"Didn't receive reminder email"**
- Check spam/junk folder
- Verify email address in your profile is correct
- Some email providers may delay delivery by a few minutes

**"Machine shows occupied but seems empty"**
- Previous user may be returning soon
- If empty for 10+ minutes, contact the previous user via email
- Report to administrators if the machine appears broken

**"How do I change my building?"**
- Click "Profile" in the top menu
- Select your new dormitory building
- Changes take effect immediately

**"Can I use multiple machines at once?"**
- You can only have one active session per machine type
- You can run a washer and dryer simultaneously
- Use the "In use by me" filter to track your sessions

## 🚀 Getting Started as a User

1. Open the application in your web browser
2. Sign in with your student credentials
3. Complete your profile (select your building)
4. Start managing your laundry!

## 📱 Device Compatibility

- **Desktop** - Full featured experience with detailed information
- **Tablet** - Optimized responsive design for mid-sized screens
- **Mobile** - Touch-friendly interface for on-the-go checking

## 🎨 User Interface Highlights

- **Intuitive Dashboard** - See all machines at a glance with status indicators
- **Clean Detail Pages** - Comprehensive information for each machine
- **Color Coding** - Quick visual indicators (available = clean, in-use = occupied)
- **Responsive Design** - Works seamlessly on all screen sizes
- **Machine Codes** - Easy reference with # prefix (e.g., #WF1, #DE2)

## 📊 Machine Data Display

Each machine shows:
- **Status** - Available or In Use
- **Machine Type** - Washer or Dryer
- **Unique Code** - Easy reference (e.g., #WF1 = Washer, Building F, Unit 1)
- **Current Occupant** (if in use) - Contact info via email link
- **Previous User** (if available) - For finding forgotten items
- **Estimated Finish Time** (if in use) - When the machine will be free

## 🔄 Session Lifecycle

1. **Schedule** - Choose available machine and set duration
2. **Active** - Session running, reminder scheduled
3. **Reminder** - Email sent 10 minutes before end
4. **Complete** - Machine automatically becomes available
5. **History** - Session stored in your activity log

## 🎯 Key Benefits

✅ **Save Time** - No need to physically check machines repeatedly  
✅ **Never Forget** - Email reminders ensure you don't leave laundry unattended  
✅ **Reduce Conflicts** - Clear occupancy information prevents double-bookings  
✅ **Easy Communication** - Contact other students directly about forgotten items  
✅ **Fair Access** - Everyone gets equal opportunities to use available machines  
✅ **Convenient** - Access from anywhere on your phone or computer  

## 📧 Email Reminders

### When You'll Receive Emails

- **Session Started** - Confirmation when you book a machine
- **10-Minute Warning** - Reminder when your laundry is almost done
- **Issues** - Notifications if your reminder couldn't be scheduled

### Email Settings

- Reminders are sent to the email address associated with your account
- Check your spam/junk folder if you don't see emails
- Verify your email address is correct in your profile

## 🌟 Tips for Success

1. **Set Phone Timer** - Match your phone timer to the machine time for accuracy
2. **Early Check** - Check the app 15 minutes before your machine should finish
3. **Clear Schedule** - Don't book if you'll be unavailable when it finishes
4. **Be Courteous** - Remove your items promptly when the cycle completes
5. **Report Issues** - Let administrators know about broken machines immediately

---

**Version**: 1.0  
**Last Updated**: October 2026  
**Built for Dormitory Students**

For technical implementation details, see [FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md)
