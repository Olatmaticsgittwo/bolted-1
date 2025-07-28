import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CryptoDashboard } from './CryptoDashboard';

export function UserDashboard() {
  return <CryptoDashboard />;
}