import { Request, Response } from 'express';
import { getMandiPrices, getMarketTrendsSummary } from '../services/mandiService.js';

export async function getMandiData(req: Request, res: Response): Promise<void> {
  try {
    const { commodity, state, district, search } = req.query;

    const data = await getMandiPrices({
      commodity: commodity ? String(commodity) : undefined,
      state: state ? String(state) : undefined,
      district: district ? String(district) : undefined,
      search: search ? String(search) : undefined
    });

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getTrends(req: Request, res: Response): Promise<void> {
  try {
    const summary = await getMarketTrendsSummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
