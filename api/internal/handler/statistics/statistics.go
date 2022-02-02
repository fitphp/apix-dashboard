/**
 * Commercial License
 * Copyright (c) 2022 Shanghai YOUPU Technology Co., Ltd. all rights reserved
 */
package statistics

import (
	"github.com/apisix/manager-api/internal/core/store"
	"github.com/gin-gonic/gin"
	"github.com/shiningrush/droplet"
	wgin "github.com/shiningrush/droplet/wrapper/gin"
)

type Handler struct {
	sslStore store.Interface
	routeSize store.Interface
	serviceSize store.Interface
	upstreamSize store.Interface
	consumerStore store.Interface
	statisticsStore store.Interface
}

type Interface interface {
	List(c droplet.Context) (*StatisticsOutput, error)
}

type StatisticsOutput struct {
	sslSize 		int      `json:"total_ssl"`
	routeSize 		int      `json:"total_route"`
	serviceSize 	int      `json:"total_service"`
	upstreamSize 	int      `json:"total_upstream"`
	consumerSize 	int      `json:"total_consumer"`
}

func (h *Handler) ApplyRoute(r *gin.Engine) {
	r.GET("/apisix/admin/statistics", wgin.Wraps(h.List))
}

func (h *Handler) List(c droplet.Context) (interface{}, error) {
	output := &StatisticsOutput{0, 0, 0, 0,0}

	sslRet, err := h.sslStore.List(c.Context(), store.ListInput{})
	if err == nil {
		output.sslSize = sslRet.TotalSize
	}

	//routeRet, err := h.routeSize.List(c.Context(), store.ListInput{})
	//if err == nil {
	//	output.routeSize = routeRet.TotalSize
	//}
	//
	//serviceRet, err := h.serviceSize.List(c.Context(), store.ListInput{})
	//if err == nil {
	//	output.serviceSize = serviceRet.TotalSize
	//}
	//
	//upstreamRet, err := h.upstreamSize.List(c.Context(), store.ListInput{})
	//if err == nil {
	//	output.upstreamSize = upstreamRet.TotalSize
	//}
	//
	//consumerRet, err := h.consumerStore.List(c.Context(), store.ListInput{})
	//if err == nil {
	//	output.consumerSize = consumerRet.TotalSize
	//}

	return output, nil
}