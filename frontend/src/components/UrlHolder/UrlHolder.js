import React, {Component} from 'react';
import { Input, Button, Icon, Grid, Form } from 'semantic-ui-react';

class UrlHolder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isUrlBarLocked: props.urlData.isUrlLocked,
            urlString: props.urlData.urlText
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.urlData.isUrlLocked !== state.isUrlBarLocked) {
          return {
            isUrlBarLocked: props.urlData.isUrlLocked,
          };
        }

        return null;
    }


    toggleUrlBarLock = () => {
        console.log("toggleUrlBarLock");
        this.props.toggleUrlLock();
    }

    handleUrlInputChange = (e) => {
        console.log("handleUrlInputChange; e: ", e.currentTarget.value);
        const currentUrl = e.currentTarget.value;
        this.setState({
            urlString: currentUrl
        });
    }

    handleUrlInputSubmit = () => {
        this.props.setUrlText(this.state.urlString);
        this.props.toggleUrlLock();
        window.location.reload();
    }

    renderLockButton = () => {
        const {isUrlBarLocked} = this.state
        return (
            <Button 
                onClick={this.toggleUrlBarLock}
                animated='vertical'
                fluid
            >
                {isUrlBarLocked ?
                    <>
                        <Button.Content hidden>Unlock</Button.Content>
                        <Button.Content visible>
                            <Icon name='unlock' />
                        </Button.Content>
                    </> :
                    <>
                        <Button.Content hidden>Lock</Button.Content>
                        <Button.Content visible>
                            <Icon name='lock' />
                        </Button.Content>
                    </>
                }

            </Button>
        );
    }

    render() {
        return (

            <div className="url-holder">
                <Grid>
                    <Grid.Row 
                        // verticalAlign={"middle"}
                    >

                        <Grid.Column width={2}>
                            {this.renderLockButton()}
						</Grid.Column>

                        <Grid.Column width={14}>
                            <Form>
                                <Form.Group inline>
                                    <Form.Field width={14}>
                                        <Input 
                                            disabled={this.state.isUrlBarLocked}
                                            fluid
                                            placeholder='Url...' 
                                            value={this.state.urlString}
                                            onChange={this.handleUrlInputChange}
                                        />
                                    </Form.Field>

                                    <Form.Field width={2}>
                                        <Button 
                                            disabled={this.state.isUrlBarLocked}
                                            fluid
                                            type='submit' 
                                            onClick={this.handleUrlInputSubmit}
                                        >
                                            <Button.Content>Set Url</Button.Content>
                                        </Button>
                                    </Form.Field>
                                </Form.Group>
                            </Form>
                        </Grid.Column>

					</Grid.Row>
				</Grid>
            </div>

        );
    }
}

export default UrlHolder;