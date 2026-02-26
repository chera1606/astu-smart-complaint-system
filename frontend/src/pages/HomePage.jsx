import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import {
    Box, Button, Container, Typography, Grid, Card, CardContent, AppBar, Toolbar,
    Chip, Stack, IconButton, Divider, useScrollTrigger, Slide, Fade, Menu, MenuItem
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VerifiedIcon from '@mui/icons-material/Verified';
import LoginIcon from '@mui/icons-material/Login';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { AuthContext } from '../context/AuthContext';

const HideOnScroll = (props) => {
    const { children } = props;
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const features = [
    {
        icon: <ReportProblemIcon sx={{ fontSize: 40 }} />,
        title: 'Submit Complaints',
        desc: 'Easily report campus issues with detailed descriptions and supporting attachments.',
        color: '#3b82f6',
    },
    {
        icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
        title: 'Track Your Issue',
        desc: 'Monitor your complaint status in real-time using a unique auto-generated Tracking ID.',
        color: '#6366f1',
    },
    {
        icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
        title: 'AI Assistant',
        desc: 'Get instant support and guidance through our integrated AI-powered assistant.',
        color: '#10b981',
    },
    {
        icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
        title: 'Transparent Workflow',
        desc: 'Clear visibility from submission to resolution — every step is tracked and documented.',
        color: '#f59e0b',
    },
];

const SectionTitle = ({ title, subtitle, light = true }) => (
    <Box textAlign="center" mb={10}>
        <Typography
            variant="overline"
            sx={{
                color: light ? '#93c5fd' : '#2563eb',
                fontWeight: 800,
                letterSpacing: 3,
                textTransform: 'uppercase',
                display: 'block',
                mb: 1
            }}
        >
            {subtitle}
        </Typography>
        <Typography
            variant="h3"
            fontWeight={900}
            color={light ? 'white' : '#1e293b'}
            gutterBottom
            sx={{
                fontSize: { xs: '2.2rem', md: '3.5rem' },
                letterSpacing: -1,
                mb: 2
            }}
        >
            {title}
        </Typography>
        <Box sx={{
            width: 80,
            height: 5,
            background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
            mx: 'auto',
            borderRadius: 10,
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
        }} />
    </Box>
);

const HomePage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleLoginClick = (event) => setAnchorEl(event.currentTarget);
    const handleLoginClose = () => setAnchorEl(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => scroll.scrollToTop();

    const astuBg = "https://tse4.mm.bing.net/th/id/OIP.kX7ZfLV_0JgPCIUmw5GjIwHaD3?pid=Api&h=220&P=0";

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#020617' }}>

            {/* ===== HEADER / NAVBAR ===== */}
            <HideOnScroll>
                <AppBar
                    position="fixed"
                    elevation={scrolled ? 4 : 0}
                    sx={{
                        background: scrolled ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
                        backdropFilter: scrolled ? 'blur(12px)' : 'none',
                        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: 'white'
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 }, height: { xs: 70, md: 100 } }}>
                        <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                            onClick={scrollToTop}
                        >
                            <Box sx={{
                                background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                                p: 1.2,
                                borderRadius: '14px',
                                display: 'flex',
                                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)'
                            }}>
                                <SchoolIcon sx={{ color: 'white', fontSize: { xs: 24, md: 32 } }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight={900} sx={{ lineHeight: 1, letterSpacing: -0.5, fontSize: { xs: '1.1rem', md: '1.4rem' } }}>
                                    ASTU <Typography component="span" variant="inherit" sx={{ color: '#60a5fa' }}>Smart</Typography>
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.65rem' }}>
                                    Complaint System
                                </Typography>
                            </Box>
                        </Box>

                        <Stack direction="row" spacing={5} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            {['About', 'Features', 'Contact'].map((item) => (
                                <ScrollLink
                                    key={item}
                                    to={item.toLowerCase()}
                                    smooth={true}
                                    duration={700}
                                    offset={-100}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            color: 'rgba(255,255,255,0.7)',
                                            letterSpacing: 0.5,
                                            '&:hover': { color: 'white' },
                                            transition: 'all 0.3s',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: -4,
                                                left: 0,
                                                width: 0,
                                                height: 2,
                                                background: '#60a5fa',
                                                transition: 'width 0.3s'
                                            },
                                            '&:hover::after': { width: '100%' }
                                        }}
                                    >
                                        {item}
                                    </Typography>
                                </ScrollLink>
                            ))}
                            <Button
                                variant="contained"
                                onClick={handleLoginClick}
                                startIcon={<LoginIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 800,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
                                    '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)', transform: 'translateY(-2px)' },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Login
                            </Button>

                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleLoginClose}
                                PaperProps={{
                                    sx: {
                                        bgcolor: 'rgba(15, 23, 42, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'white',
                                        borderRadius: '16px',
                                        mt: 1.5,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        minWidth: 180,
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                                    }
                                }}
                            >
                                <MenuItem component={RouterLink} to="/login/student" onClick={handleLoginClose} sx={{ py: 1.5, fontWeight: 700, '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' } }}>Student Login</MenuItem>
                                <MenuItem component={RouterLink} to="/login/staff" onClick={handleLoginClose} sx={{ py: 1.5, fontWeight: 700, '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' } }}>Staff Login</MenuItem>
                                <MenuItem component={RouterLink} to="/login/admin" onClick={handleLoginClose} sx={{ py: 1.5, fontWeight: 700, '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' } }}>Admin Login</MenuItem>
                            </Menu>
                        </Stack>

                        <IconButton
                            sx={{ display: { xs: 'flex', md: 'none' }, color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                            onClick={handleLoginClick}
                        >
                            <LoginIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>

            {/* ===== HERO SECTION ===== */}
            <Box
                sx={{
                    position: 'relative',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: `linear-gradient(rgba(2, 6, 23, 0.7), rgba(2, 6, 23, 0.9)), url(${astuBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                {/* Glowing Orbs */}
                <Box sx={{
                    position: 'absolute', top: '15%', right: '5%', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute', bottom: '15%', left: '5%', width: '350px', height: '350px',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <Fade in={true} timeout={1200}>
                        <Box>
                            <Chip
                                label="Official ASTU Platform"
                                component="a"
                                href="https://www.astu.edu.et"
                                target="_blank"
                                clickable
                                sx={{
                                    mb: 4,
                                    bgcolor: 'rgba(59, 130, 246, 0.15)',
                                    color: '#93c5fd',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    fontWeight: 800,
                                    px: 2,
                                    py: 2.5,
                                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.25)' }
                                }}
                            />
                            <Typography
                                variant="h1"
                                fontWeight={900}
                                color="white"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: '2.8rem', sm: '4rem', md: '5.5rem' },
                                    lineHeight: { xs: 1.2, md: 1 },
                                    letterSpacing: -2,
                                    mb: 3,
                                    textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                }}
                            >
                                Empowering ASTU <Box component="span" sx={{
                                    background: 'linear-gradient(90deg, #60a5fa 0%, #818cf8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'block',
                                    mt: 1
                                }}>Digital Integrity</Box>
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ color: 'rgba(255,255,255,0.7)', mb: 7, maxWidth: 800, mx: 'auto', fontWeight: 500, lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.25rem' } }}
                            >
                                Adama Science and Technology University's official smart reporting portal.
                                Securely report issues, track resolutions in real-time, and experience next-gen campus transparency.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                                <Button
                                    variant="contained"
                                    component={RouterLink}
                                    to="/login/student"
                                    size="large"
                                    sx={{
                                        background: 'white',
                                        color: '#020617',
                                        px: 7, py: 2.5, fontWeight: 900, fontSize: '1.1rem',
                                        borderRadius: '20px', textTransform: 'none',
                                        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(255,255,255,0.2)' },
                                        transition: 'all 0.4s'
                                    }}
                                >
                                    Start Reporting
                                </Button>
                                <ScrollLink to="about" smooth={true} duration={800} offset={-100}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            color: 'white',
                                            borderColor: 'rgba(255,255,255,0.4)',
                                            px: 7, py: 2.5, fontWeight: 900, fontSize: '1.1rem',
                                            borderRadius: '20px', textTransform: 'none',
                                            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-5px)' },
                                            transition: 'all 0.4s'
                                        }}
                                    >
                                        Explore System
                                    </Button>
                                </ScrollLink>
                            </Stack>
                        </Box>
                    </Fade>
                </Container>

                <Box sx={{
                    position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)',
                    color: 'rgba(255,255,255,0.4)', cursor: 'pointer', animation: 'bounce 2.5s infinite',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1
                }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>Scroll</Typography>
                    <ScrollLink to="about" smooth={true} offset={-100}>
                        <ArrowDownwardIcon sx={{ fontSize: 32 }} />
                    </ScrollLink>
                </Box>
            </Box>

            {/* ===== ABOUT SECTION (DARK MODE) ===== */}
            <Box id="about" sx={{ py: { xs: 15, md: 25 }, bgcolor: '#020617', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{
                    position: 'absolute', top: '20%', left: '-10%', width: '500px', height: '500px',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={10} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative', p: { xs: 2, md: 0 } }}>
                                <Box sx={{
                                    position: 'absolute', top: -30, right: -30, width: '100%', height: '100%',
                                    border: '2px solid rgba(59, 130, 246, 0.3)', borderRadius: 10, zIndex: 0
                                }} />
                                <Box sx={{
                                    position: 'absolute', bottom: -20, left: -20, width: '60px', height: '60px',
                                    background: 'linear-gradient(135deg, #2563eb, #6366f1)', borderRadius: 2, zIndex: 2,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.4)'
                                }}>
                                    <VerifiedIcon sx={{ color: 'white' }} />
                                </Box>
                                <Card sx={{
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                                    position: 'relative',
                                    zIndex: 1,
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <Box component="img" src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" sx={{ width: '100%', height: { xs: 350, md: 550 }, objectFit: 'cover' }} />
                                </Card>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="overline" sx={{ color: '#60a5fa', fontWeight: 900, letterSpacing: 4, mb: 2, display: 'block' }}>OUR MISSION</Typography>
                            <Typography variant="h2" fontWeight={900} color="white" sx={{ mb: 4, fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.1 }}>
                                Defining the Future of <Box component="span" sx={{ color: '#3b82f6' }}>Campus Excellence</Box>
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 5, fontSize: '1.2rem', lineHeight: 1.8 }}>
                                The ASTU Smart Complaint System is a state-of-the-art infrastructure designed to foster a culture of accountability and rapid response. By leveraging modern technology, we ensure every voice in our university is heard and every issue is resolved with precision.
                            </Typography>
                            <Grid container spacing={4}>
                                {[
                                    { title: 'Global Standards', desc: 'Secure encryption for all data.', icon: <SchoolIcon /> },
                                    { title: 'AI Enhanced', desc: 'Automated routing for speed.', icon: <SmartToyIcon /> }
                                ].map((item, idx) => (
                                    <Grid item xs={6} key={idx}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Box sx={{ color: '#60a5fa', transform: 'scale(1.2)', mb: 1 }}>{item.icon}</Box>
                                            <Typography variant="h6" fontWeight={800} color="white">{item.title}</Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{item.desc}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ===== FEATURES SECTION (BLACK MODE / GLASSMORPHISM) ===== */}
            <Box id="features" sx={{ py: { xs: 15, md: 25 }, background: 'linear-gradient(180deg, #020617 0%, #0a0f1e 100%)' }}>
                <Container maxWidth="lg">
                    <SectionTitle title="Advanced Capabilities" subtitle="Platform Core" />
                    <Grid container spacing={4}>
                        {features.map((f, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: 8,
                                        p: 3,
                                        textAlign: 'left',
                                        transition: 'all 0.4s ease',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderColor: f.color,
                                            boxShadow: `0 20px 40px ${f.color}15`,
                                            transform: 'translateY(-15px)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 0 }}>
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: 70, height: 70, borderRadius: '24px',
                                            background: `linear-gradient(135deg, ${f.color}20, ${f.color}40)`,
                                            color: f.color, mb: 4,
                                            boxShadow: `0 8px 20px ${f.color}20`
                                        }}>
                                            {f.icon}
                                        </Box>
                                        <Typography variant="h5" fontWeight={900} color="white" sx={{ mb: 2, fontSize: '1.4rem' }}>{f.title}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '0.95rem' }}>{f.desc}</Typography>
                                    </CardContent>
                                    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{ color: f.color, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>Active Feature</Typography>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: f.color, animation: 'pulse 2s infinite' }} />
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ===== CONTACT SECTION (DARK MODE) ===== */}
            <Box id="contact" sx={{ py: 20, bgcolor: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Container maxWidth="lg">
                    <SectionTitle title="Get In Touch" subtitle="Global Support" light />
                    <Grid container spacing={10}>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h3" fontWeight={900} sx={{ mb: 3, color: 'white', letterSpacing: -1 }}>Need Assistance?</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 6, fontSize: '1.15rem', lineHeight: 1.8 }}>
                                Our dedicated ICT Directorate support team is ready to help you navigate the platform and resolve technical hurdles.
                            </Typography>

                            <Stack spacing={4}>
                                {[
                                    { icon: <EmailIcon />, label: 'Email Us', value: 'ict.support@astu.edu.et' },
                                    { icon: <PhoneIcon />, label: 'Call Support', value: '+251 22 110 0000' },
                                    { icon: <LocationOnIcon />, label: 'Visit Us', value: 'ICT Block, Level 3, Adama University' }
                                ].map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Box sx={{
                                            width: 65,
                                            height: 65,
                                            borderRadius: '20px',
                                            bgcolor: 'rgba(255,255,255,0.03)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#3b82f6'
                                        }}>
                                            {item.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>{item.label}</Typography>
                                            <Typography variant="h6" fontWeight={800} color="white">{item.value}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Card sx={{
                                bgcolor: 'rgba(59, 130, 246, 0.03)',
                                border: '1px solid rgba(59, 130, 246, 0.1)',
                                borderRadius: 10,
                                p: { xs: 4, md: 8 },
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    position: 'absolute', top: 0, right: 0, width: '200px', height: '200px',
                                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(50px)'
                                }} />
                                <Typography variant="h4" fontWeight={900} sx={{ mb: 4, color: 'white' }}>Enterprise Security</Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    The ASTU Smart Complaint System employs bank-grade encryption and role-based access control.
                                    Your data integrity and privacy are our highest priorities. Verified by ASTU ICT Security Directorate.
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {['256-bit SSL', 'Encrypted Storage', 'Audit Trail'].map(tag => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            sx={{
                                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                color: '#60a5fa',
                                                fontWeight: 800,
                                                border: '1px solid rgba(59, 130, 246, 0.2)'
                                            }}
                                        />
                                    ))}
                                </Box>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 6 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: '#10b981' }}>
                                        <VerifiedIcon fontSize="large" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" color="white" fontWeight={900}>99.9% System Uptime</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Ensuring academic continuity.</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ===== FOOTER ===== */}
            <Box
                component="footer"
                sx={{
                    bgcolor: '#020617',
                    color: 'rgba(255,255,255,0.4)',
                    py: 12,
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                <Container maxWidth="md">
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mb={4}>
                        <SchoolIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
                        <Typography variant="h5" color="white" fontWeight={900} sx={{ letterSpacing: -1 }}>ASTU <Typography component="span" variant="inherit" sx={{ opacity: 0.5 }}>Smart</Typography></Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ mb: 6, color: 'rgba(255,255,255,0.5)', maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
                        Empowering Adama Science and Technology University with digital transparency and efficient issue resolution services.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 2, sm: 6 }}
                        justifyContent="center"
                        mb={8}
                    >
                        {['Privacy Hub', 'Developer Portal', 'Legal Terms', 'ICT Directorate'].map(t => (
                            <Typography key={t} variant="body2" sx={{
                                fontWeight: 800,
                                color: 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                                '&:hover': { color: 'white' },
                                transition: '0.3s'
                            }}>
                                {t}
                            </Typography>
                        ))}
                    </Stack>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 2, opacity: 0.3, textTransform: 'uppercase' }}>
                            &copy; {new Date().getFullYear()} ASTU ICT DIRECTORATE.
                        </Typography>
                        <Box sx={{ width: 40, height: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
                    </Box>
                </Container>
            </Box>

            <style>
                {`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateX(-50%) translateY(0);}
                    40% {transform: translateX(-50%) translateY(-10px);}
                    60% {transform: translateX(-50%) translateY(-5px);}
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.7; }
                    50% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.7; }
                }
                `}
            </style>
        </Box>
    );
};

export default HomePage;
