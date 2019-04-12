const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();

io.on('connection', (client) => {


    client.on('siguienteTicket', (data, callback) => {

        let siguiente = ticketControl.siguiente();

        console.log(siguiente);
        callback(siguiente);

    })

    // emitir un evento 'estadoActual'
    client.emit('estadoActual', {
        actual: ticketControl.getUlltimoTicket(),
        ultimos4: ticketControl.getUlltimos4()
    });

    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                masaje: 'El escritorio es necsario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        //  actualizar o notificar cambios en los ultimos 4
        client.broadcast.emit('ultimos4', {
                ultimos4: ticketControl.getUlltimos4()
            })
            // emitir 'ultimos4'


    });

});