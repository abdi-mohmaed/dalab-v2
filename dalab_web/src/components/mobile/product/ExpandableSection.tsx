'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Collapse, IconButton } from '@mui/material';
import {
    KeyboardArrowDown as ArrowDown,
    KeyboardArrowUp as ArrowUp
} from '@mui/icons-material';
import { spacing } from '@/theme/mobile';

interface ExpandableSectionProps {
    title: string;
    children: React.ReactNode;
    initiallyExpanded?: boolean;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
    title,
    children,
    initiallyExpanded = true
}) => {
    const [expanded, setExpanded] = useState(initiallyExpanded);

    return (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', py: spacing.lg }}>
            <Box
                onClick={() => setExpanded(!expanded)}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}
            >
                <Typography variant="h3">{title}</Typography>
                <IconButton size="small">
                    {expanded ? <ArrowUp /> : <ArrowDown />}
                </IconButton>
            </Box>
            <Collapse in={expanded}>
                <Box sx={{ pt: spacing.md }}>
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
};
