import { ReactNode, SyntheticEvent, useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProfileTab from './components/profileTab';
import { Activity } from './components/activity';
import { profile_0000 } from '../../styles/profile';
import { setactiveCat } from '../../redux/slices/uiGolobalSlice';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../components/modals/AlertModal';
import { MODAL_TYPES, useGlobalModalContext } from '../../components/modals';
import { WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL } from '../../utils/constants';

const tabsStyle = {
  'width': '320px',

  '& .MuiTabs-indicator': {
    left: 0,
    backgroundColor: 'rgba(243, 82, 63, 1)',
    height: '25px !important',
    width: 8,
    marginTop: 1,
  },
};
interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    'id': `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

let varShowModal: any = null;
const onConnectWallet = () => {
  if (varShowModal) {
    varShowModal(MODAL_TYPES.CONNECT_WALLET, {
      title: 'Create instance form',
      confirmBtn: 'Save',
    });
  }
};

interface ProfilePageProps {
  defaultTab?: number;
}

const Profile = (props: ProfilePageProps) => {
  const { defaultTab } = props;
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(defaultTab ? defaultTab : 0); ///// default tab index
  const user = useSelector((state: any) => state.auth.user);
  // fliter NFT code
  const { activeCat } = useSelector((state: any) => state.uiGolobal);

  const [openAlert, setOpenAlert] = useState(false);

  const { showModal } = useGlobalModalContext();
  varShowModal = showModal;

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const [width, setWidth] = useState(window.innerWidth);

  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    //console.log('useEffect');

    if (!user.address) {
      onConnectWallet();
    }
  }, [user]);

  return (
    <>
      {!user?.address ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
          }}
        >
          <Typography>Connect wallet first</Typography>
        </Box>
      ) : (
        <Box sx={profile_0000}>
          <Box
            sx={{
              display:
                width > WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL
                  ? { md: 'block', miniMobile: 'none' }
                  : 'none',
              flexGrow: 0,
            }}
          >
            {/* <Tab
                sx={{ display: 'none' }}
                label=<Typography
                  variant="h4"
                  sx={{ p: 1, ml: 4 }}
                  fontWeight={700}
                ></Typography>
                {...a11yProps(0)}
              />
              <Tab
                label=<Typography
                  variant="h4"
                  sx={{ p: 1, ml: 4 }}
                  fontWeight={700}
                >
                  Profile
                </Typography>
                {...a11yProps(1)}
              /> */}
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={activeTab}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={tabsStyle}
            >
              <Tab
                label={
                  <Typography
                    variant="h4"
                    sx={{ p: 1, ml: 4 }}
                    fontWeight={700}
                  >
                    Activity
                  </Typography>
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  <Typography
                    variant="h4"
                    sx={{ p: 1, ml: 4 }}
                    fontWeight={700}
                  >
                    My NFTs
                  </Typography>
                }
                {...a11yProps(1)}
              />

              {activeTab === 1 ? (
                <Box sx={{ marginLeft: 6, marginTop: -4 }}>
                  <Box sx={{ display: 'flex', marginBottom: 1 }}>
                    <Box sx={{}}>
                      <Box
                        sx={{
                          borderLeft: '2px solid rgba(0, 0, 0, 0.4)',
                          borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
                          width: '30px',
                          height: '40px',
                        }}
                      ></Box>
                      <Box sx={{ width: '30px', height: '40px' }}></Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 2,
                      }}
                    >
                      <img
                        width="20px"
                        style={{ objectFit: 'contain', marginRight: '16px' }}
                        src={
                          activeCat === 'art'
                            ? '/images/node-iconRed.svg'
                            : '/images/node-icon.svg'
                        }
                      />
                      <Typography
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          dispatch(setactiveCat('art'));
                        }}
                      >
                        NFT Artwork
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', marginTop: -2 }}>
                    <Box sx={{}}>
                      <Box
                        sx={{
                          borderLeft: '2px solid rgba(0, 0, 0, 0.4)',
                          borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
                          width: '30px',
                          height: '40px',
                        }}
                      ></Box>
                      <Box sx={{ width: '30px', height: '40px' }}></Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 2,
                      }}
                    >
                      <img
                        style={{
                          width: '20px',
                          marginRight: '16px',
                        }}
                        src={
                          activeCat === 'node'
                            ? '/images/artwork-iconRed.svg'
                            : '/images/artwork-icon.svg'
                        }
                      />

                      <Typography
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          dispatch(setactiveCat('node'));
                        }}
                      >
                        Node List
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <></>
              )}

              <Box sx={{ display: 'flex', flex: 1 }}></Box>
            </Tabs>
          </Box>
          {/* <TabPanel value={value} index={1}>
            <ProfileTab activeFilter={activeCat} change={handleChange} />
          </TabPanel> */}

          {/* <Box sx={{ position: 'absolute', left: 80, bottom: 20, width: '100%' }}>
                <DropDown />
            </Box> */}
          <TabPanel value={activeTab} index={0}>
            <Activity change={handleChange} />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <ProfileTab activeFilter={activeCat} change={handleChange} />
          </TabPanel>
        </Box>
      )}

      <AlertModal
        onClose={() => {
          setOpenAlert(false);
        }}
        open={openAlert}
      />
    </>
  );
};

export default Profile;
