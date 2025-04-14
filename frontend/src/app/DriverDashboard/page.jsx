"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Alert,
  Tooltip,
  LinearProgress,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import {
  DirectionsCar,
  LocationOn,
  AccessTime,
  AttachMoney,
  Person,
  MoreVert,
  Refresh,
  FilterList,
  Search,
  EventSeat,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material"
import axios from "axios"

export default function DriverDashboard() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortField, setSortField] = useState("departureTime")
  const [sortDirection, setSortDirection] = useState("desc")
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRide, setSelectedRide] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get("http://localhost:5000/rides", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      })
      setRides(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching rides:", error)
      setError("Failed to load rides. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRide = () => {
    router.push("/CreateRide")
  }

  const handleRefresh = () => {
    fetchRides()
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleMenuOpen = (event, ride) => {
    setAnchorEl(event.currentTarget)
    setSelectedRide(ride)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRide(null)
  }

  const handleEditRide = () => {
    if (selectedRide) {
      router.push(`/EditRide/${selectedRide.id}`)
    }
    handleMenuClose()
  }

  const handleCancelRide = () => {
    // Implement cancel ride functionality
    handleMenuClose()
  }

  const sortedRides = [...rides].sort((a, b) => {
    if (sortField === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price
    } else if (sortField === "departureTime") {
      return sortDirection === "asc"
        ? new Date(a.departureTime) - new Date(b.departureTime)
        : new Date(b.departureTime) - new Date(a.departureTime)
    } else if (sortField === "availableSeats") {
      return sortDirection === "asc" ? a.availableSeats - b.availableSeats : b.availableSeats - a.availableSeats
    }
    return 0
  })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "completed":
        return "info"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
            color: "white",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Driver Dashboard
              </Typography>
              <Typography variant="subtitle1">Manage your rides and track your earnings</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<DirectionsCar />}
              onClick={handleCreateRide}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontWeight: "bold",
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              Create New Ride
            </Button>
          </Box>
        </Paper>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Your Rides
          </Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh rides">
              <IconButton onClick={handleRefresh} color="primary" sx={{ bgcolor: "white", boxShadow: 1 }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter rides">
              <IconButton color="primary" sx={{ bgcolor: "white", boxShadow: 1 }}>
                <FilterList />
              </IconButton>
            </Tooltip>
            <Tooltip title="Search rides">
              <IconButton color="primary" sx={{ bgcolor: "white", boxShadow: 1 }}>
                <Search />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  bgcolor: "white",
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar sx={{ bgcolor: "#4caf50", width: 40, height: 40 }}>
                    <DirectionsCar />
                  </Avatar>
                  <Typography variant="h6" fontWeight="medium">
                    Total Rides
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {loading ? <Skeleton width={60} /> : rides.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  bgcolor: "white",
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar sx={{ bgcolor: "#2196f3", width: 40, height: 40 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h6" fontWeight="medium">
                    Active Rides
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {loading ? (
                    <Skeleton width={60} />
                  ) : (
                    rides.filter((ride) => ride.status.toLowerCase() === "active").length
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  bgcolor: "white",
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar sx={{ bgcolor: "#ff9800", width: 40, height: 40 }}>
                    <AttachMoney />
                  </Avatar>
                  <Typography variant="h6" fontWeight="medium">
                    Total Earnings
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {loading ? (
                    <Skeleton width={80} />
                  ) : (
                    `$${rides.reduce((sum, ride) => sum + (ride.price || 0), 0).toFixed(2)}`
                  )}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box mb={2}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              bgcolor: "white",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">
                Sort by:
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  size="small"
                  variant={sortField === "departureTime" ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleSort("departureTime")}
                  endIcon={
                    sortField === "departureTime" ? (
                      sortDirection === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )
                    ) : null
                  }
                >
                  Date
                </Button>
                <Button
                  size="small"
                  variant={sortField === "price" ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleSort("price")}
                  endIcon={
                    sortField === "price" ? (
                      sortDirection === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )
                    ) : null
                  }
                >
                  Price
                </Button>
                <Button
                  size="small"
                  variant={sortField === "availableSeats" ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleSort("availableSeats")}
                  endIcon={
                    sortField === "availableSeats" ? (
                      sortDirection === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )
                    ) : null
                  }
                >
                  Seats
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        {loading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} action={<Button onClick={handleRefresh}>Retry</Button>}>
            {error}
          </Alert>
        )}

        {!loading && rides.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              bgcolor: "white",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No rides found
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              You haven't created any rides yet. Click the button below to create your first ride.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCreateRide} startIcon={<DirectionsCar />}>
              Create New Ride
            </Button>
          </Paper>
        )}

        <Grid container spacing={3}>
          {sortedRides.map((ride) => (
            <Grid item xs={12} sm={6} md={4} key={ride.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                  },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    height: 8,
                    width: "100%",
                    bgcolor: (theme) => theme.palette[getStatusColor(ride.status)].main,
                  }}
                />
                <CardContent sx={{ pt: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      label={ride.status}
                      color={getStatusColor(ride.status)}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, ride)} sx={{ mt: -1, mr: -1 }}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {ride.startLocation} → {ride.endLocation}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(ride.departureTime)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      {ride.distance || "N/A"} km
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <EventSeat fontSize="small" color="action" />
                    <Typography variant="body2" color="textSecondary">
                      {ride.availableSeats} seats available
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      ${ride.price}
                    </Typography>
                    <Chip label={`${ride.bookedSeats || 0} booked`} size="small" variant="outlined" color="primary" />
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button size="small" variant="outlined" fullWidth>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditRide}>Edit Ride</MenuItem>
          <MenuItem onClick={handleCancelRide}>Cancel Ride</MenuItem>
          <MenuItem onClick={handleMenuClose}>View Passengers</MenuItem>
        </Menu>
      </Container>
    </Box>
  )
}
