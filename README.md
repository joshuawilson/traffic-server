# traffic-server
A service that consumes HTTP traffic data and replays it over WebSocket.

## Setup

    git clone git@github.com:Red-Hat-Middleware-Keynote/traffic-server.git
    cd traffic-server
    npm install
    npm start

Now that the traffic server is running, go get the [pipeline-demo](https://github.com/Red-Hat-Middleware-Keynote/pipeline-demo) UI so you can see the traffic data visualized!

## Reporting traffic

Traffic data must be reported to the traffic server.  This is done by POSTing a simple JSON object to the traffic server.

    curl -H "Content-Type: application/json" -XPOST --data '{"from":0,"to":3}' http://localhost:3003/record

The JSON object, `{"from":0,"to":3}`, indicates which server sent the request, and which one received it.  They're currently identified by integer IDs, but that's likely to change.

Once received, the traffic server will subsequently send the data to the pipeline demo UI over a WebSocket connection.
