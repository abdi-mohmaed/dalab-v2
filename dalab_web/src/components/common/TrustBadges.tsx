import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';

const TrustBadge = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <Stack direction="row" alignItems="center" spacing={0.5}>
        <Icon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {text}
        </Typography>
    </Stack>
);

export const TrustBadges = () => {
    return (
        <Box sx={{ mt: 1, px: 1 }}>
            <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{
                    opacity: 0.8,
                    '& > *': { flexShrink: 0 }
                }}
            >
                <TrustBadge icon={SecurityOutlinedIcon} text="Secure Payment" />
                <TrustBadge icon={AssignmentReturnOutlinedIcon} text="Free Returns" />
                <TrustBadge icon={LocalShippingOutlinedIcon} text="Fast Delivery" />
            </Stack>
        </Box>
    );
};
