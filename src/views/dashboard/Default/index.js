import {Component} from 'react';

// material-ui
import {Grid} from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import {gridSpacing} from 'store/constant';
import {GlobalConfig} from "../../../ultrahand/globalConfig";
import {ComponentPool} from "../../../ultrahand/core/componentPool";
import {IconArrowDownCircle} from "@tabler/icons";

// ==============================|| DEFAULT DASHBOARD ||============================== //

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            componentOutputs: {},
            componentInputConfigs: {}
        }

        GlobalConfig.getSingleton().update = () => {
            this.setState({isLoading: false})
        }
    }

    render() {
        let pool = new ComponentPool()
        let list = []
        GlobalConfig.getSingleton().nodes.forEach((node, index) => {

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

            list.push(<Grid item xs={10}>
                <Grid container spacing={gridSpacing}>
                    {index > 0 ?
                        <Grid item lg={8} md={8} sm={8} xs={8} sx={{display: 'flex', justifyContent: 'center'}}>
                            <IconArrowDownCircle size={'50'}/>
                        </Grid> : <></>}
                    <Grid item lg={8} md={8} sm={8} xs={8}>
                        <EarningCard component={pool.getComponent(node.componentID)}
                                     returnInputConfig={returnInputConfig(index)}
                                     returnOutput={returnOutput(index)}
                                     prevOutput={((index) => {
                                         return () => {
                                             if (index === 0) return null

                                             return this.state.componentOutputs[index - 1]
                                         }
                                     })(index)} isLoading={false}/>
                    </Grid>
                </Grid>
            </Grid>)
        });

        return (
            <Grid container spacing={gridSpacing}>
                {list}
            </Grid>
        );
    }
}

// const Dashboard = () => {
//   const [isLoading, setLoading] = useState(true);
//   useEffect(() => {
//     setLoading(false);
//   }, []);
//
//
//   let list = []
//   GlobalConfig.getSingleton().nodes.forEach((node) => {
//     list.push(<Grid item xs={12}>
//         <Grid container spacing={gridSpacing}>
//             <Grid item lg={4} md={6} sm={6} xs={12}>
//                 <EarningCard isLoading={isLoading} />
//             </Grid>
//         </Grid>
//     </Grid>)
//   });
//
//   return (
//     <Grid container spacing={gridSpacing}>
//         {list}
//     </Grid>
//   );
// };

export default Dashboard;
