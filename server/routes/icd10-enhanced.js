'use strict';

import express from 'express';
import axios from 'axios';
import { MongoClient } from 'mongodb';

const router = express.Router();

// AI Learning Service Class
class DrugICD10LearningService {
    constructor(mongoUri) {
        this.mongoUri = mongoUri;
        this.client = null;
        this.db = null;
        this.learningCollection = null;
    }

    async connect() {
        try {
            this.client = new MongoClient(this.mongoUri);
            await this.client.connect();
            this.db = this.client.db('pharmgenius');
            this.learningCollection = this.db.collection('icd10_learning');
            return true;
        } catch (error) {
            console.error('MongoDB connection failed:', error);
            return false;
        }
    }

    async learn(drugName, icd10Code, confidence = 0.8) {
        if (!this.learningCollection) return false;
        
        try {
            await this.learningCollection.updateOne(
                { drugName: drugName.toLowerCase() },
                { 
                    $set: { 
                        drugName: drugName.toLowerCase(),
                        icd10Code,
                        confidence,
                        lastUpdated: new Date()
                    }
                },
                { upsert: true }
            );
            return true;
        } catch (error) {
            console.error('Learning failed:', error);
            return false;
        }
    }

    async search(query) {
        if (!this.learningCollection) return [];
        
        try {
            const results = await this.learningCollection.find({
                drugName: { $regex: query.toLowerCase(), $options: 'i' }
            }).limit(10).toArray();
            return results;
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }

    async healthCheck() {
        try {
            if (!this.client) return { status: 'disconnected' };
            await this.client.db('admin').command({ ping: 1 });
            return { status: 'connected', database: 'pharmgenius' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }
}

// Initialize service
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmgenius';
const learningService = new DrugICD10LearningService(mongoUri);
learningService.connect();

// Routes
router.get('/health', async (req, res) => {
    const health = await learningService.healthCheck();
    res.json({
        service: 'ICD-10 Enhanced Learning',
        timestamp: new Date().toISOString(),
        mongodb: health
    });
});

router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    
    const results = await learningService.search(q);
    res.json({ query: q, results, count: results.length });
});

router.post('/learn', async (req, res) => {
    const { drugName, icd10Code, confidence } = req.body;
    if (!drugName || !icd10Code) {
        return res.status(400).json({ error: 'drugName and icd10Code required' });
    }
    
    const success = await learningService.learn(drugName, icd10Code, confidence);
    res.json({ success, drugName, icd10Code });
});

router.get('/learning-data', async (req, res) => {
    if (!learningService.learningCollection) {
        return res.json({ data: [], count: 0 });
    }
    
    try {
        const data = await learningService.learningCollection.find({}).limit(100).toArray();
        res.json({ data, count: data.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as icd10EnhancedRouter };
