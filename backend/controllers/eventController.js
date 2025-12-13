import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, date } = req.body;
    const newEvent = new Event({
      user: req.user.id,
      title,
      date
    });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};