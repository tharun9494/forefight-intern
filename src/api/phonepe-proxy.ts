import express, { Request, Response, RequestHandler } from 'express';
import axios from 'axios';
import { PHONEPE_CONFIG } from '@/config/phonepe';

const router = express.Router();

interface PhonePeProxyRequestBody {
  url?: string;
  request?: string;
}

const handlePhonePeProxy: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, request } = (req.body || {}) as PhonePeProxyRequestBody;

    if (!url || !request || typeof url !== 'string' || typeof request !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Missing or invalid required parameters: url and request are required strings',
      });
      return;
    }

    const xVerify = req.headers['x-verify'];
    const xVerifyHeader = typeof xVerify === 'string' ? xVerify : Array.isArray(xVerify) ? xVerify[0] : '';

    console.log('Proxy Request:', {
      url,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
      },
    });

    // Forward the request to PhonePe
    const response = await axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
      },
      data: {
        request,
      },
      timeout: 10000, // 10 second timeout
    });

    // Validate response data
    if (!response.data) {
      throw new Error('Empty response from PhonePe');
    }

    console.log('PhonePe Response:', response.data);

    // Send the response back to the client
    res.json(response.data);
    return;
  } catch (error: unknown) {
    console.error('Proxy error:', error);

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        res.status(504).json({
          success: false,
          message: 'Payment gateway timeout. Please try again.',
        });
        return;
      }

      if (error.response) {
        const responseData = error.response.data as Record<string, unknown> | undefined;
        const message =
          responseData && typeof responseData === 'object' && 'message' in responseData && typeof responseData.message === 'string'
            ? responseData.message
            : 'Payment gateway error';

        res.status(error.response.status).json({
          success: false,
          message,
          details: responseData,
        });
        return;
      }

      if (error.request) {
        res.status(503).json({
          success: false,
          message: 'No response from payment gateway. Please try again.',
        });
        return;
      }
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      success: false,
      message,
    });
    return;
  }
};

router.post('/', handlePhonePeProxy);

export default router;
