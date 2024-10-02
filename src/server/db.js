import supabase from '../config/supabase.config';
import { ROLES } from '../constants/roles';

// User-related functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone_number, role');
  if (error) throw error;
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      email: userData.email,
      full_name: userData.fullName,
      phone_number: userData.phoneNumber,
      role: userData.role || ROLES.USER
    });
  if (error) throw error;
  return data;
};

export const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(userData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

// Services registry log functions
export const getServicesLogs = async () => {
  const { data, error } = await supabase
    .from('services_logs')
    .select('*, profiles(full_name), services(service_name)');
  if (error) throw error;
  return data;
};

export const createServiceLog = async (serviceData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .insert(serviceData);
  if (error) throw error;
  return data;
};

export const updateServiceLog = async (id, serviceData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .update(serviceData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteServiceLog = async (id) => {
  const { data, error } = await supabase
    .from('services_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const createAdminUser = async (userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      email: userData.email,
      full_name: userData.fullName,
      phone_number: userData.phoneNumber,
      role: ROLES.ADMIN
    });
  if (error) throw error;
  return data;
};

export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData);
  if (error) throw error;
  return data;
};

export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*');
  if (error) throw error;
  return data;
};

export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .insert(bookingData);
  if (error) throw error;
  return data;
};

export const getPaidServicesWaiting = async () => {
  const { data, error } = await supabase
    .from('services_logs')
    .select('*, profiles(full_name), services(service_name)')
    .eq('status', 'paid')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateServiceStatus = async (id, newStatus) => {
  const { data, error } = await supabase
    .from('services_logs')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const getBookings = async () => {
  const { data, error } = await supabase
    .from('services_logs')
    .select('*, profiles(full_name), services(service_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateBooking = async (id, bookingData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .update(bookingData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteBooking = async (id) => {
  const { data, error } = await supabase
    .from('services_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

// Analytics function
export const getAnalytics = async () => {
  const [usersCount, bookingsCount, revenueData] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('services_logs').select('id', { count: 'exact' }),
    supabase.from('services_logs').select('total_cost')
  ]);

  const totalRevenue = revenueData.data?.reduce((sum, booking) => sum + (booking.total_cost || 0), 0) || 0;

  return {
    usersCount: usersCount.count,
    bookingsCount: bookingsCount.count,
    totalRevenue
  };
};