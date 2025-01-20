# from flask import Flask, jsonify
# from flask_cors import CORS
# import yfinance as yf

# app = Flask(__name__)
# CORS(app)

# @app.route('/api/financials/<ticker>')
# def get_financials(ticker):
#     try:
#         stock = yf.Ticker(ticker)
        
#         # Obtener datos del estado de resultados
#         income_stmt = stock.financials
        
#         # Obtener datos del balance general
#         balance_sheet = stock.balance_sheet
        
#         # Obtener datos del flujo de efectivo
#         cash_flow = stock.cashflow
        
#         return jsonify({
#             'incomeStatement': income_stmt.to_dict(),
#             'balanceSheet': balance_sheet.to_dict(),
#             'cashFlow': cash_flow.to_dict()
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

# import pandas as pd  # Importa pandas
# from flask import Flask, jsonify
# from flask_cors import CORS
# import yfinance as yf

# app = Flask(__name__)
# CORS(app)

# @app.route('/api/financials/<ticker>')
# def get_financials(ticker):
#     try:
#         stock = yf.Ticker(ticker)
        
#         # Obtener datos del estado de resultados
#         income_stmt = stock.financials
        
#         # Obtener datos del balance general
#         balance_sheet = stock.balance_sheet
        
#         # Obtener datos del flujo de efectivo
#         cash_flow = stock.cashflow
        
#         # Función para convertir Timestamps a cadenas y asegurar que las claves sean strings
#         def convert_data(data):
#             if isinstance(data, dict):
#                 return {str(key): convert_data(value) for key, value in data.items()}
#             elif isinstance(data, pd.Timestamp):  # Si es un Timestamp, convertirlo a string
#                 return data.strftime('%Y-%m-%d')  # O cualquier formato de fecha que desees
#             return data
        
#         # Limpiar los datos convirtiendo las claves y valores que sean Timestamps
#         income_stmt = convert_data(income_stmt.to_dict())
#         balance_sheet = convert_data(balance_sheet.to_dict())
#         cash_flow = convert_data(cash_flow.to_dict())
        
#         return jsonify({
#             'incomeStatement': income_stmt,
#             'balanceSheet': balance_sheet,
#             'cashFlow': cash_flow
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

import pandas as pd  # Importa pandas
from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
import time  # Importa el módulo time

app = Flask(__name__)
CORS(app)

@app.route('/api/financials/<ticker>')
def get_financials(ticker):
    start_time = time.time()  # Registra el tiempo de inicio

    try:
        stock = yf.Ticker(ticker)

        # Obtener datos del estado de resultados
        income_stmt = stock.financials

        # Obtener datos del balance general
        balance_sheet = stock.balance_sheet

        # Obtener datos del flujo de efectivo
        cash_flow = stock.cashflow

        # Función para convertir Timestamps a cadenas y asegurar que las claves sean strings
        def convert_data(data):
            if isinstance(data, dict):
                return {str(key): convert_data(value) for key, value in data.items()}
            elif isinstance(data, pd.Timestamp):  # Si es un Timestamp, convertirlo a string
                return data.strftime('%Y-%m-%d')  # O cualquier formato de fecha que desees
            return data

        # Limpiar los datos convirtiendo las claves y valores que sean Timestamps
        income_stmt = convert_data(income_stmt.to_dict())
        balance_sheet = convert_data(balance_sheet.to_dict())
        cash_flow = convert_data(cash_flow.to_dict())

        end_time = time.time()  # Registra el tiempo de finalización
        elapsed_time = end_time - start_time  # Calcula el tiempo transcurrido

        print(f"Tiempo de ejecución para obtener datos financieros de {ticker}: {elapsed_time:.2f} segundos")

        return jsonify({
            'incomeStatement': income_stmt,
            'balanceSheet': balance_sheet,
            'cashFlow': cash_flow,
            'executionTime': elapsed_time  # Incluir el tiempo de ejecución en la respuesta
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
