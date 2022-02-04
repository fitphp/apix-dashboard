/**
 * Commercial License
 * Copyright (c) 2022 Shanghai YOUPU Technology Co., Ltd. all rights reserved
 */
package statistic

import (
	"github.com/apisix/manager-api/internal/core/store"
	"github.com/apisix/manager-api/internal/handler"
	"github.com/gin-gonic/gin"
	"github.com/shiningrush/droplet"
	wgin "github.com/shiningrush/droplet/wrapper/gin"
)

type Handler struct {
	sslStore store.Interface
	routeStore store.Interface
	serviceStore store.Interface
	upstreamStore store.Interface
	consumerStore store.Interface
	serverInfoStore store.Interface
}

func NewHandler() (handler.RouteRegister, error) {
	return &Handler{
		sslStore: store.GetStore(store.HubKeySsl),
		routeStore:    store.GetStore(store.HubKeyRoute),
		serviceStore:  store.GetStore(store.HubKeyService),
		upstreamStore: store.GetStore(store.HubKeyUpstream),
		consumerStore: store.GetStore(store.HubKeyConsumer),
		serverInfoStore: store.GetStore(store.HubKeyServerInfo),
	}, nil
}

type Interface interface {
	statisticGlobSize(c droplet.Context) (*TotalSize, error)
}

type TotalSize struct {
	TotalSSL		int      `json:"total_ssl"`
	TotalRoute 		int      `json:"total_route"`
	TotalService 	int      `json:"total_service"`
	TotalUpstream 	int      `json:"total_upstream"`
	TotalConsumer 	int      `json:"total_consumer"`
	TotalServer		int 	 `json:"total_server"`
}

func (h *Handler) ApplyRoute(r *gin.Engine) {
	r.GET("/apisix/admin/statistics", wgin.Wraps(h.statisticTotalSize))
}

func (h *Handler) statisticTotalSize(c droplet.Context) (interface{}, error) {
	// init output
	output := TotalSize{
		TotalSSL: 0,
		TotalRoute: 0,
		TotalService: 0,
		TotalUpstream: 0,
		TotalConsumer: 0,
	}

	listInput := store.ListInput{
		Predicate:  nil,
		PageSize:   0,
		PageNumber: 0,
	}

	sslRet, err := h.sslStore.List(c.Context(), listInput)
	if err == nil {
		output.TotalSSL = sslRet.TotalSize
	}

	routeRet, err := h.routeStore.List(c.Context(), listInput)
	if err == nil {
		output.TotalRoute = routeRet.TotalSize
	}

	serviceRet, err := h.serviceStore.List(c.Context(), listInput)
	if err == nil {
		output.TotalService = serviceRet.TotalSize
	}

	upstreamRet, err := h.upstreamStore.List(c.Context(), listInput)
	if err == nil {
		output.TotalUpstream = upstreamRet.TotalSize
	}

	consumerRet, err := h.consumerStore.List(c.Context(), listInput)
	if err == nil {
		output.TotalConsumer = consumerRet.TotalSize
	}

	serverInfoRet, err := h.serverInfoStore.List(c.Context(), listInput)
	if err == nil {
		output.TotalServer = serverInfoRet.TotalSize
	}

	// output TotalSize
	return output, nil
}