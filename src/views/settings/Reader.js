import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Form from '../../components/Form';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import View from '../../components/View';

const ipcRenderer = window.require('electron').ipcRenderer;

const styles = theme => ({
    status: {
        textAlign: 'center',
        marginTop: theme.spacing.unit * 2
    },
    statusError: {
        color: 'red'
    }
})

class Reader extends Component {
    state = {
        address: '',
        port: '',
        status: null
    }

    handleAddressChange = value => {
        this.setState({ address: value });
    }

    handlePortChange = value => {
        this.setState({ port: value });
    }

    handleConnect = () => {
        const { port, address } = this.state;
        ipcRenderer.send('reader:connect', port === ''? 3334 : port, address === ''? '127.0.0.1' : address);
    }

    componentDidMount() {
        ipcRenderer.send('reader:status');

        ipcRenderer.on('reader:status', (e, status) => this.setState({ status }));
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners();
    }

    render() {
        const { classes } = this.props;

        const { status } = this.state;

        return (
            <View
                back
                title={<Translate id='section.reader' />}
            >
                <Form>
                    <TextField
                        autoFocus
                        gutterTop
                        onChange={this.handleAddressChange}
                        label={<Translate id='address' />}
                        placeholder='127.0.0.1'
                        defaultValue='127.0.0.1'
                    />
                    <TextField
                        gutterTop
                        onChange={this.handlePortChange}
                        label={<Translate id='port' />}
                        placeholder='3334'
                        defaultValue='3334'
                    />
                    <Button
                        gutterTop
                        onClick={this.handleConnect}
                    >
                        <Translate id='connect' />
                    </Button>
                    {status &&
                        <Typography
                            className={classNames(classes.status, status.success || classes.statusError)}
                            variant='caption'
                        >
                            <Translate id={status.translationId} />
                            {status.success && ` ${status.data.address}:${status.data.port}`}
                        </Typography>
                    }
                </Form>
            </View>
        )
    }
}

export default withStyles(styles)(Reader);
