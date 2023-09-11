from flask import Flask, request, jsonify
from ariadne import make_executable_schema, gql, load_schema_from_path, graphql_sync
from ariadne.explorer import ExplorerPlayground
from model import query

PLAYGROUND_HTML = ExplorerPlayground(title="API").html(None)

type_defs = gql(load_schema_from_path("./schema.graphql"))
schema = make_executable_schema(type_defs, query)

app = Flask(__name__)
@app.route('/')
def home():
    return 'welcome to main; status: 200'
@app.route('/graphql', methods=["GET"])
def gql_interface():
    return PLAYGROUND_HTML,200
@app.route('/graphql', methods=["POST"])
def get_gql_api():
    data = request.get_json()
    success, result = graphql_sync(schema, data, context_value=request, debug=app.debug)
    staus_code = 200 if success else 400
    return jsonify(result), staus_code

if __name__ == "__main__":
    app.run(debug=True)