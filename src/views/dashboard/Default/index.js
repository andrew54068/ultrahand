import {Component} from 'react';

// material-ui
import {Button, Grid, Input, Typography} from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import {gridSpacing} from 'store/constant';
import {GlobalConfig} from "../../../ultrahand/globalConfig";
import {ComponentPool} from "../../../ultrahand/core/componentPool";
import {IconArrowDownCircle} from "@tabler/icons";
import {InvokePool} from "../../../ultrahand/core/invokePool";
import {UserOperationPool} from "../../../ultrahand/core/userOperationPool";
import {UltrahandWallet} from "../../../ultrahand/core/ultrahandWallet";
import {ComponentGraph} from "../../../ultrahand/core/componentGraph";
import Grow from "@mui/material/Grow";
import * as React from "react";

// ==============================|| DEFAULT DASHBOARD ||============================== //

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            componentOutputs: {},
            componentInputConfigs: {},

            nodesForPreview: [],
            currentNode: null,
            transitionView: null,
            inTransition: false
        }

        GlobalConfig.getSingleton().update = () => {
            this.setState({isLoading: false})
        }
    }

    previewMode() {
        if (this.state.inTransition) {
            return this.state.transitionView
        }

        if (!this.state.currentNode && this.state.currentNode !== 0) {
            return <Button sx={{width: '80%', background: '#ff91008c'}} onClick={() => {
                if (!this.state.currentNode && this.state.currentNode !== 0) {
                    this.setState({nodesForPreview: this.nodesForPreview()})
                    this.setState({currentNode: 0})
                } else {
                    this.setState({currentNode: this.state.currentNode + 1})
                }
            }}>Start</Button>
        } else if (this.state.currentNode >= this.state.nodesForPreview.length) {
            return <Button sx={{width: '80%', background: '#ff91008c'}} onClick={ async () => {
                await this.UserGo()
                this.setState({currentNode: null})
            }}>GO!</Button>
        }

        let prevNode = this.state.nodesForPreview[this.state.currentNode - 1]
        let node = this.state.nodesForPreview[this.state.currentNode]
        let copyNodes = this.state.nodesForPreview
        let impl = new ComponentPool().getComponent(node.componentID)
        if (impl == null) {
            alert('component not found: ' + node.componentID)
        } else {
            let instance = new impl()
            if (node.inputs[0].type === 'link') {
                const linkedOutput = prevNode.outputs[node.inputs[0].value.outputIndex]
                node.inputs[0].value = linkedOutput.value
            } else if (node.inputs[0].type === 'custom' && node.inputs[0].value === null) {
                return <div>
                    <Input onChange={(event) => {
                        node.inputs[0].value = event.target.value
                    }}></Input>
                    <Button onClick={() => {
                        copyNodes[this.state.currentNode] = node
                        this.setState({nodesForPreview: copyNodes})
                    }}>Submit</Button>
                </div>
            }
            instance.Run(node.inputs).then(async () => {
                function resolveAfter1Seconds(timeout) {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve('resolved');
                        }, timeout);
                    });
                }

                copyNodes[this.state.currentNode].outputs = instance.getOutput()

                this.setState({inTransition: true, transitionView: <Grow
                        in={true}
                        style={{ transformOrigin: '0 0 0' }}
                        {...({ timeout: 1000 })}
                    >
                        <Typography sx={{
                            fontSize: '1.125rem',
                            fontWeight: 300,
                            mr: 1,
                            mt: 1.75,
                            mb: 0.75,
                            width: '80%',
                        }}>
                            Your {node.componentID} input value: {copyNodes[this.state.currentNode].inputs[0].value} {instance.inputOptions()[copyNodes[this.state.currentNode].inputs[0].optionIndex].name}
                        </Typography>
                    </Grow>})

                await resolveAfter1Seconds(2000);

                if (copyNodes[this.state.currentNode].outputs.length > 0) {
                    this.setState({transitionView: null})
                    await resolveAfter1Seconds(1000);
                    this.setState({transitionView: <Grow
                            in={true}
                            style={{ transformOrigin: '0 0 0' }}
                            {...({ timeout: 1000 })}
                        >
                            <Typography sx={{
                                fontSize: '1.125rem',
                                fontWeight: 300,
                                mr: 1,
                                mt: 1.75,
                                mb: 0.75,
                                width: '80%',
                            }}>
                                Your {node.componentID} output value: {copyNodes[this.state.currentNode].outputs[0].value} {copyNodes[this.state.currentNode].outputs[0].name}
                            </Typography>
                        </Grow>})

                    await resolveAfter1Seconds(3000);
                }

                this.setState({nodesForPreview: copyNodes, currentNode: this.state.currentNode + 1})
                this.setState({transitionView: null, inTransition: false})
            })
        }
    }

    nodesForPreview() {
        let nodes = []
        GlobalConfig.getSingleton().nodes.forEach(((node, index) => {
            let copyInputConfigs = JSON.parse(JSON.stringify(this.state.componentInputConfigs[index]));
            if (copyInputConfigs[0].type === 'link') {
                copyInputConfigs[0].value = {
                    componentIndex: index - 1,
                    outputIndex: 0,
                }
            } else if (copyInputConfigs[0].type === 'custom') {
                copyInputConfigs[0].value = null
            }
            nodes.push({
                componentID: node.componentID,
                inputs: copyInputConfigs,
            })
        }));

        return nodes
    }

    async UserGo() {
        console.log(this.state.nodesForPreview)
        let nodes = []
        this.state.nodesForPreview.forEach(((node, index) => {
            let copyInputConfigs = this.state.nodesForPreview[index].inputs
            if (copyInputConfigs[0].type === 'link') {
                copyInputConfigs[0].value = {
                    componentIndex: index - 1,
                    outputIndex: 0,
                }
            }
            nodes.push({
                componentID: node.componentID,
                inputs: copyInputConfigs,
            })
        }));

        InvokePool.getSingleton().clearInvoke()
        UserOperationPool.getSingleton().clear()

        await new ComponentGraph(nodes).run()

        let unsignedUOP = UserOperationPool.getSingleton().popUserOperation()
        let signedUOP = await UltrahandWallet.currentWallet.simulateTx(unsignedUOP)
        await UltrahandWallet.currentWallet.sendTx(signedUOP)
    }

    async SimulateAndSend() {
        let nodes = []
        GlobalConfig.getSingleton().nodes.forEach(((node, index) => {
            let copyInputConfigs = this.state.componentInputConfigs[index]
            if (copyInputConfigs[0].type === 'link') {
                copyInputConfigs[0].value = {
                    componentIndex: index - 1,
                    outputIndex: 0,
                }
            }
            nodes.push({
                componentID: node.componentID,
                inputs: copyInputConfigs,
            })
        }));
        console.log(nodes)
        InvokePool.getSingleton().clearInvoke()
        UserOperationPool.getSingleton().clear()

        await new ComponentGraph(nodes).run()

        let unsignedUOP = UserOperationPool.getSingleton().popUserOperation()
        let signedUOP = await UltrahandWallet.currentWallet.simulateTx(unsignedUOP)
        await UltrahandWallet.currentWallet.sendTx(signedUOP)
    }

    render() {
        let pool = new ComponentPool()
        let list = []
        GlobalConfig.getSingleton().nodes.forEach((node, index, nodes) => {

            let returnOutput = (index) => {
                return (output) => {
                    let copyOutputs = this.state.componentOutputs
                    copyOutputs[index] = output
                    this.setState({componentOutputs: copyOutputs})
                }
            }

            let returnInputConfig = (index) => {
                return (inputConfig) => {
                    let copyInputConfig = this.state.componentInputConfigs
                    copyInputConfig[index] = inputConfig
                    this.setState({componentInputConfigs: copyInputConfig})
                }
            }

            list.push(<Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={gridSpacing}>
                    {index > 0 ?
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                            <IconArrowDownCircle size={'50'}/>
                        </Grid> : <></>}
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <EarningCard
                            component={pool.getComponent(node.componentID)}
                            returnInputConfig={returnInputConfig(index)}
                            returnOutput={returnOutput(index)}
                            prevOutput={this.state.componentOutputs[index - 1]}
                            isLoading={false}/>
                    </Grid>
                    {index === nodes.length - 1 ?
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Button sx={{
                                width: '100%',
                                borderRadius: `5px`,
                                marginTop: '20px',
                                background: 'cornflowerblue',
                                ":hover": {
                                    background: 'dodgerblue',
                                },
                                color: 'white'
                            }} alignItems="center" onClick={this.SimulateAndSend.bind(this)}>
                                Simulate & Send
                            </Button>
                        </Grid> : <></>}
                </Grid>
            </Grid>)
        });

        return (
            <Grid container spacing={gridSpacing}>
                <Grid item xs={6}>
                    {list}
                </Grid>
                <Grid sx={{padding: '30px'}} item lg={6} md={6} sm={6} xs={6}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Typography sx={{
                            fontSize: '2.125rem',
                            fontWeight: 500,
                            mr: 1,
                            mt: 1.75,
                            mb: 0.75,
                            width: '80%',
                        }}>
                            Preview Mode
                        </Typography>
                    </Grid>
                    {this.previewMode()}
                </Grid>
            </Grid>
        );
    }
}

export default Dashboard;
