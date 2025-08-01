const mongoose = require('mongoose');

const dummyEvents = [
  {
    title: 'Tech Innovators Summit',
    description: 'A gathering of top tech leaders discussing AI, ML, and more.',
    type: 'Conference',
    date: 'Mon Jul 01 2025',
    time: '10:00:00',
    venue: 'Bangalore International Convention Centre',
    banner: 'https://wallpaperaccess.com/full/959317.jpg',
    host: new mongoose.Types.ObjectId(),
    cohosts: [new mongoose.Types.ObjectId()],
    rsvps: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    attendees: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'Startup Pitch Day',
    description: 'Pitch your startup idea to investors and VCs.',
    type: 'Networking',
    date: 'Tue Jul 02 2025',
    time: '14:30:00',
    venue: 'T-Hub Hyderabad',
    banner: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1470&q=80',
    host: new mongoose.Types.ObjectId(),
    cohosts: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    rsvps: [new mongoose.Types.ObjectId()],
    attendees: [],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'Designers Meet & Expo',
    description: 'Explore the future of UX/UI design with talks, demos, and workshops.',
    type: 'Workshop',
    date: 'Wed Jul 03 2025',
    time: '09:00:00',
    venue: 'India Habitat Centre, Delhi',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    host: new mongoose.Types.ObjectId(),
    cohosts: [],
    rsvps: [],
    attendees: [],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'Eco Fest 2025',
    description: 'A sustainability-driven event featuring green startups and solutions.',
    type: 'Festival',
    date: 'Sat Jul 06 2025',
    time: '12:00:00',
    venue: 'Eco Grounds, Pune',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    host: new mongoose.Types.ObjectId(),
    cohosts: [new mongoose.Types.ObjectId()],
    rsvps: [new mongoose.Types.ObjectId()],
    attendees: [new mongoose.Types.ObjectId()],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'Code Camp India',
    description: 'A nationwide hackathon for coding enthusiasts.',
    type: 'Hackathon',
    date: 'Fri Jul 12 2025',
    time: '18:00:00',
    venue: 'IIT Bombay Campus',
    banner: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    host: new mongoose.Types.ObjectId(),
    cohosts: [new mongoose.Types.ObjectId()],
    rsvps: [],
    attendees: [],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'Women in Tech Meetup',
    description: 'A networking event celebrating women in technology.',
    type: 'Meetup',
    date: 'Sun Jul 14 2025',
    time: '11:00:00',
    venue: 'WeWork, Bengaluru',
    banner: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1470&q=80',
    host: new mongoose.Types.ObjectId(),
    cohosts: [],
    rsvps: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    attendees: [new mongoose.Types.ObjectId()],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'AI Art Exhibition',
    description: 'Showcasing AI-generated artworks and installations.',
    type: 'Exhibition',
    date: 'Wed Jul 17 2025',
    time: '16:00:00',
    venue: 'Kala Academy, Goa',
    banner: 'https://images.unsplash.com/photo-1549924231-f129b911e442',
    host: new mongoose.Types.ObjectId(),
    cohosts: [new mongoose.Types.ObjectId()],
    rsvps: [],
    attendees: [],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'Open Source DevCon',
    description: 'Talks and workshops by open source contributors from around the world.',
    type: 'Conference',
    date: 'Mon Jul 22 2025',
    time: '13:00:00',
    venue: 'HICC, Hyderabad',
    banner: 'https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1470&q=80',
    host: new mongoose.Types.ObjectId(),
    cohosts: [new mongoose.Types.ObjectId()],
    rsvps: [],
    attendees: [],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'Blockchain India Forum',
    description: 'Discussing DeFi, crypto, and Web3 in the Indian context.',
    type: 'Summit',
    date: 'Sat Jul 27 2025',
    time: '10:30:00',
    venue: 'Jio World Centre, Mumbai',
    banner: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    host: new mongoose.Types.ObjectId(),
    cohosts: [new mongoose.Types.ObjectId()],
    rsvps: [],
    attendees: [],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  },
  {
    title: 'Food Startup Expo',
    description: 'Bringing together India’s top food startups for a 2-day exhibition.',
    type: 'Expo',
    date: 'Sun Jul 28 2025',
    time: '15:00:00',
    venue: 'NSIC Grounds, New Delhi',
    banner: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80',
    host: new mongoose.Types.ObjectId(),
    cohosts: [],
    rsvps: [],
    attendees: [],
    createdAt: new Date(),
    enums: ['Development', 'Architecture']
  }
];

module.exports = dummyEvents;
