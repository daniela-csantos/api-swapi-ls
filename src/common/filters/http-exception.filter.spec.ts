import { AllExceptionsFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockHost: Partial<ArgumentsHost>;

    beforeEach(() => {
        filter = new AllExceptionsFilter();

        mockRequest = {
            method: 'GET',
            url: '/test-route',
            route: {}, 
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockHost = {
            switchToHttp: () => ({
                getRequest: () => mockRequest,
                getResponse: () => mockResponse,
                getNext: () => undefined,
            }),
        } as unknown as ArgumentsHost;
    });

    it('should handle HttpException with custom message', () => {
        const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 404,
                message: 'Not Found',
                path: '/test-route',
            }),
        );
    });

    it('should handle generic exception', () => {
        const exception = new Error('Something failed');

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 500,
                message: 'Internal server error',
                path: '/test-route',
            }),
        );
    });

    it('should return custom not found message if no route matched', () => {
        (mockRequest.route as any) = undefined; // simula rota não encontrada

        const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Route GET /test-route not found',
            }),
        );
    });
});
