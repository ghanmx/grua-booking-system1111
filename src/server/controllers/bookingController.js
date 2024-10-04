const supabase = require('../config/database');
const { sendAdminNotification } = require('../../utils/adminNotification');
const { logger } = require('../middleware/errorHandler');

exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = {
      profile_id: req.body.userId,
      service_id: req.body.serviceId,
      status: 'pending',
      total_cost: req.body.totalCost,
      payment_status: 'pending',
      user_id: req.user.id
    };

    const { data: createdBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData);
    
    if (bookingError) throw bookingError;

    logger.info(`New booking created: ${JSON.stringify(createdBooking)}`);
    
    try {
      await sendAdminNotification(createdBooking[0], createdBooking[0].total_cost);
    } catch (notificationError) {
      logger.error(`Failed to send admin notification: ${notificationError.message}`);
      // Continue execution even if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: createdBooking[0]
    });
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('services_logs')
      .select('*, profiles(full_name), services(service_name)', { count: 'exact' })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      count,
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    logger.error(`Error fetching bookings: ${error.message}`);
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services_logs')
      .select('*, profiles(full_name), services(service_name)')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    logger.error(`Error fetching booking by ID: ${error.message}`);
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services_logs')
      .update(req.body)
      .eq('id', req.params.id);
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: data[0]
    });
  } catch (error) {
    logger.error(`Error updating booking: ${error.message}`);
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('services_logs')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting booking: ${error.message}`);
    next(error);
  }
};