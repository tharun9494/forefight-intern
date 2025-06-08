import express, { Request, Response } from 'express';
import axios from 'axios';
import { PHONEPE_CONFIG } from '../config/phonepe';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { url, request } = req.body;

    if (!url || !request) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    console.log('Proxy Request:', {
      url,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': req.headers['x-verify'],
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId
      }
    });

    // Forward the request to PhonePe
    const response = await axios({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': req.headers['x-verify'],
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId
      },
      data: {
        request: request
      },
      timeout: 10000 // 10 second timeout
    });

    // Validate response data
    if (!response.data) {
      throw new Error('Empty response from PhonePe');
    }

    console.log('PhonePe Response:', response.data);

    // Send the response back to the client
    res.json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error);

    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Payment gateway timeout. Please try again.'
      });
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data?.message || 'Payment gateway error',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({
        success: false,
        message: 'No response from payment gateway. Please try again.'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
});

export default router; 